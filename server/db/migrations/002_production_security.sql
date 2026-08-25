alter table refresh_sessions add column family_id uuid;
update refresh_sessions set family_id = id where family_id is null;
alter table refresh_sessions alter column family_id set not null;
alter table refresh_sessions add column replaced_by_session_id uuid references refresh_sessions(id) on delete set null;

create index refresh_sessions_family_active_idx
  on refresh_sessions(family_id, expires_at)
  where revoked_at is null;

alter table users add column token_version integer not null default 0;

create table rate_limit_windows (
  scope varchar(64) not null,
  subject varchar(255) not null,
  window_started_at timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (scope, subject, window_started_at)
);

create index rate_limit_windows_expiry_idx on rate_limit_windows(window_started_at);
