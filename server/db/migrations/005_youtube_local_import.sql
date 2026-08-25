-- YouTube imports are intentionally local-only. The URL is retained as provenance;
-- worker-downloaded media is stored by the same private media storage pipeline.
alter table media_assets drop constraint if exists media_assets_source_type_check;
alter table media_assets
  add constraint media_assets_source_type_check
  check (source_type in ('user_upload', 'catalog', 'youtube'));

alter table media_processing_jobs drop constraint if exists media_processing_jobs_job_type_check;
alter table media_processing_jobs
  add constraint media_processing_jobs_job_type_check
  check (job_type in ('upload_verify', 'youtube_download', 'extract_audio', 'transcribe', 'diarize', 'enrich_transcript', 'generate_quiz'));
