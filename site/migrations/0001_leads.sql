-- The `leads` table (§5), as D1.
--
-- Column names are snake_case to match the Postgres schema in the build plan,
-- so moving to Supabase later is a change of driver rather than of shape.
--
-- `score` is stored rather than generated: D1 has no generated columns, and
-- the value has to survive a read that does not re-run scoreLead(). It is
-- recomputed on every write instead — see D1LeadStore.
CREATE TABLE IF NOT EXISTS leads (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  move_in       TEXT NOT NULL,

  name          TEXT,
  phone         TEXT,
  bedrooms      TEXT,
  budget        TEXT,
  renter_type   TEXT,
  floor_plan_id TEXT,

  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  utm_content   TEXT,
  utm_term      TEXT,
  fbclid        TEXT,
  gclid         TEXT,
  landing_slug  TEXT,
  referrer      TEXT,

  score         INTEGER NOT NULL DEFAULT 0,
  status        TEXT    NOT NULL DEFAULT 'new',
  created_at    TEXT    NOT NULL,
  updated_at    TEXT    NOT NULL
);

-- The leasing team triages by score, newest first. Without this the list view
-- is a full scan the moment the campaign works.
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads (score DESC, created_at DESC);
