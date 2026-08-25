-- Video AI and shadowing foundation. This migration stores metadata only;
-- binary video/audio storage and background processing arrive in phase 2.

create table media_assets (
  id uuid primary key,
  owner_user_id uuid not null references users(id) on delete cascade,
  source_type varchar(32) not null check (source_type in ('user_upload', 'catalog')),
  title varchar(200) not null,
  language varchar(10) not null default 'ja' check (language in ('ja')),
  rights_basis varchar(32) not null check (rights_basis in ('owned', 'licensed', 'internal', 'unknown')),
  source_reference varchar(500),
  original_filename varchar(255),
  storage_key varchar(500),
  mime_type varchar(100),
  byte_size bigint check (byte_size is null or byte_size >= 0),
  duration_ms integer check (duration_ms is null or duration_ms > 0),
  processing_status varchar(32) not null default 'draft'
    check (processing_status in ('draft', 'uploading', 'queued', 'processing', 'ready', 'failed', 'cancelled')),
  error_code varchar(100),
  error_message varchar(500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index media_assets_owner_created_idx on media_assets(owner_user_id, created_at desc) where deleted_at is null;
create index media_assets_processing_idx on media_assets(processing_status, created_at) where deleted_at is null;

create table media_processing_jobs (
  id uuid primary key,
  media_asset_id uuid not null references media_assets(id) on delete cascade,
  job_type varchar(40) not null check (job_type in ('upload_verify', 'extract_audio', 'transcribe', 'diarize', 'enrich_transcript', 'generate_quiz')),
  status varchar(32) not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  attempt_count smallint not null default 0 check (attempt_count >= 0 and attempt_count <= 10),
  provider varchar(100),
  provider_job_id varchar(255),
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  error_code varchar(100),
  error_message varchar(500),
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index media_processing_jobs_asset_created_idx on media_processing_jobs(media_asset_id, created_at desc);
create index media_processing_jobs_queue_idx on media_processing_jobs(status, created_at) where status = 'queued';

create table transcript_versions (
  id uuid primary key,
  media_asset_id uuid not null references media_assets(id) on delete cascade,
  version smallint not null check (version > 0),
  language varchar(10) not null default 'ja' check (language in ('ja')),
  source varchar(32) not null check (source in ('machine', 'editor', 'import')),
  provider varchar(100),
  status varchar(32) not null default 'draft' check (status in ('draft', 'processing', 'ready', 'failed', 'superseded')),
  quality_score numeric(5, 2) check (quality_score is null or (quality_score >= 0 and quality_score <= 100)),
  created_by_user_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (media_asset_id, version)
);

create unique index transcript_versions_current_ready_idx
  on transcript_versions(media_asset_id)
  where status = 'ready';

create table transcript_segments (
  id uuid primary key,
  transcript_version_id uuid not null references transcript_versions(id) on delete cascade,
  sequence_no integer not null check (sequence_no > 0),
  speaker_label varchar(40),
  speaker_confidence numeric(5, 2) check (speaker_confidence is null or (speaker_confidence >= 0 and speaker_confidence <= 100)),
  start_ms integer not null check (start_ms >= 0),
  end_ms integer not null check (end_ms > start_ms),
  text_ja text not null,
  text_furigana text,
  text_vi text,
  confidence numeric(5, 2) check (confidence is null or (confidence >= 0 and confidence <= 100)),
  reviewed_at timestamptz,
  reviewed_by_user_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (transcript_version_id, sequence_no)
);

create index transcript_segments_timeline_idx on transcript_segments(transcript_version_id, start_ms);

create table segment_tokens (
  id uuid primary key,
  transcript_segment_id uuid not null references transcript_segments(id) on delete cascade,
  sequence_no smallint not null check (sequence_no > 0),
  surface varchar(255) not null,
  reading varchar(255),
  lemma varchar(255),
  part_of_speech varchar(100),
  start_ms integer check (start_ms is null or start_ms >= 0),
  end_ms integer check (end_ms is null or end_ms >= start_ms),
  created_at timestamptz not null default now(),
  unique (transcript_segment_id, sequence_no)
);

create table grammar_annotations (
  id uuid primary key,
  transcript_segment_id uuid not null references transcript_segments(id) on delete cascade,
  pattern varchar(255) not null,
  explanation_vi text,
  start_char integer check (start_char is null or start_char >= 0),
  end_char integer check (end_char is null or end_char >= start_char),
  confidence numeric(5, 2) check (confidence is null or (confidence >= 0 and confidence <= 100)),
  created_at timestamptz not null default now()
);

create table video_quizzes (
  id uuid primary key,
  media_asset_id uuid not null references media_assets(id) on delete cascade,
  transcript_segment_id uuid references transcript_segments(id) on delete set null,
  quiz_type varchar(40) not null check (quiz_type in ('listening_choice', 'cloze', 'ordering', 'meaning', 'grammar')),
  prompt jsonb not null,
  answer_key jsonb not null,
  status varchar(32) not null default 'draft' check (status in ('draft', 'reviewed', 'published', 'archived')),
  generated_by varchar(32) not null check (generated_by in ('template', 'ai', 'editor')),
  reviewed_by_user_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index video_quizzes_asset_status_idx on video_quizzes(media_asset_id, status);

create table shadowing_sessions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  media_asset_id uuid not null references media_assets(id) on delete cascade,
  transcript_version_id uuid references transcript_versions(id) on delete set null,
  mode varchar(32) not null check (mode in ('sequential', 'random', 'roleplay')),
  selected_speaker_label varchar(40),
  status varchar(32) not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  current_segment_sequence integer check (current_segment_sequence is null or current_segment_sequence > 0),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index shadowing_sessions_user_started_idx on shadowing_sessions(user_id, started_at desc);

create table shadowing_attempts (
  id uuid primary key,
  session_id uuid not null references shadowing_sessions(id) on delete cascade,
  transcript_segment_id uuid not null references transcript_segments(id) on delete restrict,
  attempt_no smallint not null check (attempt_no > 0),
  audio_storage_key varchar(500),
  duration_ms integer check (duration_ms is null or duration_ms > 0),
  recognized_text text,
  alignment jsonb not null default '{}'::jsonb,
  evaluator_provider varchar(100),
  evaluation_status varchar(32) not null default 'pending'
    check (evaluation_status in ('pending', 'processing', 'scored', 'failed', 'unscorable')),
  created_at timestamptz not null default now(),
  unique (session_id, transcript_segment_id, attempt_no)
);

create index shadowing_attempts_session_segment_idx on shadowing_attempts(session_id, transcript_segment_id, attempt_no desc);

create table shadowing_scores (
  shadowing_attempt_id uuid primary key references shadowing_attempts(id) on delete cascade,
  overall_score numeric(5, 2) check (overall_score is null or (overall_score >= 0 and overall_score <= 100)),
  content_score numeric(5, 2) check (content_score is null or (content_score >= 0 and content_score <= 100)),
  pronunciation_score numeric(5, 2) check (pronunciation_score is null or (pronunciation_score >= 0 and pronunciation_score <= 100)),
  timing_score numeric(5, 2) check (timing_score is null or (timing_score >= 0 and timing_score <= 100)),
  prosody_score numeric(5, 2) check (prosody_score is null or (prosody_score >= 0 and prosody_score <= 100)),
  confidence numeric(5, 2) check (confidence is null or (confidence >= 0 and confidence <= 100)),
  feedback jsonb not null default '{}'::jsonb,
  scoring_version varchar(100) not null,
  created_at timestamptz not null default now()
);
