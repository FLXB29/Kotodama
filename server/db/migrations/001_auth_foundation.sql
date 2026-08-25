create table users (
  id uuid primary key,
  name varchar(100) not null,
  email varchar(254) not null,
  password_hash text not null,
  role varchar(20) not null default 'learner' check (role in ('learner', 'admin')),
  status varchar(20) not null default 'active' check (status in ('active', 'suspended')),
  email_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz,
  constraint users_email_normalized check (email = lower(email)),
  constraint users_email_unique unique (email)
);

create table refresh_sessions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  token_hash char(64) not null unique,
  csrf_hash char(64) not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  ip_address inet,
  user_agent varchar(500)
);

create index refresh_sessions_user_id_idx on refresh_sessions(user_id);
create index refresh_sessions_active_idx on refresh_sessions(expires_at) where revoked_at is null;

create table one_time_tokens (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  token_hash char(64) not null unique,
  purpose varchar(32) not null check (purpose in ('password_reset', 'email_verification')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  consumed_at timestamptz
);

create index one_time_tokens_lookup_idx on one_time_tokens(token_hash, purpose);
create index one_time_tokens_expiry_idx on one_time_tokens(expires_at) where consumed_at is null;

create table audit_logs (
  id uuid primary key,
  actor_user_id uuid references users(id) on delete set null,
  action varchar(100) not null,
  target_user_id uuid references users(id) on delete set null,
  ip_address inet,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_created_at_idx on audit_logs(created_at desc);
create index audit_logs_actor_idx on audit_logs(actor_user_id, created_at desc);
