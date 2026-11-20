-- Bot de WhatsApp da Aprile: restaurantes, dados do bot, conversas e mensagens.
-- RLS ligado e sem políticas: só a service role (usada pela Edge Function) acessa.

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cnpj text,
  instance text not null unique,
  instance_token text not null,
  team_phone text not null,
  default_lang text not null default 'pt' check (default_lang in ('pt', 'es', 'en')),
  handoff_hours int not null default 12 check (handoff_hours > 0),
  active boolean not null default true,
  timezone text not null default 'America/Bahia',
  created_at timestamptz not null default now()
);

create table public.knowledge (
  restaurant_id uuid primary key references public.restaurants (id) on delete cascade,
  data jsonb not null,
  published_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  phone text not null,
  lang text check (lang in ('pt', 'es', 'en')),
  paused_until timestamptz,
  created_at timestamptz not null default now(),
  unique (restaurant_id, phone)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  direction text not null check (direction in ('client', 'bot', 'team')),
  text text not null,
  external_id text unique,
  input_tokens int,
  output_tokens int,
  cache_read_tokens int,
  created_at timestamptz not null default now()
);

create index messages_conversation_created on public.messages (conversation_id, created_at desc);

alter table public.restaurants enable row level security;
alter table public.knowledge enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
