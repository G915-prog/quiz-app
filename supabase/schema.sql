-- Reference only — reflects the actual quiz_scores table in Supabase
-- Table: public.quiz_scores
-- RLS: enabled
--   "Public leaderboard read"  → SELECT → public
--   "Users insert own scores"  → INSERT → public (with check: true)
--   "Users delete own scores"  → DELETE → authenticated

create table public.quiz_scores (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid,           -- nullable, no foreign key (guest saves)
  username           text not null,
  score              int4 not null,
  total_questions    int4 not null,
  category           text not null,
  difficulty         text,
  time_taken_seconds int4,
  created_at         timestamptz default now()
);
