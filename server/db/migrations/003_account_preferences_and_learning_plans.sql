create table account_preferences (
  user_id uuid primary key references users(id) on delete cascade,
  daily_words smallint not null default 20 check (daily_words in (10, 20, 30, 50)),
  review_limit smallint check (review_limit in (50, 100, 200) or review_limit is null),
  auto_pronounce boolean not null default true,
  furigana boolean not null default true,
  romaji boolean not null default false,
  pitch_accent boolean not null default true,
  reminders boolean not null default false,
  streak_reminders boolean not null default true,
  public_profile boolean not null default false,
  analytics_enabled boolean not null default true,
  accent varchar(20) not null default 'rose' check (accent in ('rose', 'blue', 'violet', 'orange', 'emerald', 'white')),
  background varchar(20) not null default 'midnight' check (background in ('midnight', 'ocean', 'sakura', 'forest', 'ivory', 'sky')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table learning_plans (
  user_id uuid primary key references users(id) on delete cascade,
  language varchar(10) not null check (language in ('jp')),
  level varchar(20) not null check (level in ('beginner', 'elementary', 'intermediate', 'advanced')),
  daily_words smallint not null check (daily_words in (10, 20, 30, 50)),
  daily_minutes smallint not null check (daily_minutes in (10, 20, 30, 45)),
  reason varchar(1000) not null default '',
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index learning_plans_updated_at_idx on learning_plans(updated_at desc);
