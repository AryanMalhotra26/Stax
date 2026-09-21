-- The admin panel: a recency index, and the audit trail.

-- The leads list is ordered newest-first.
--
-- `idx_leads_score` already exists and cannot serve this: it leads on
-- `score DESC`, so SQLite can only use it for a `created_at` ordering by
-- reading every row and sorting. That is invisible at fifty leads and is a
-- full scan plus a sort the first time a campaign works, which is exactly
-- when somebody is watching the list.
--
-- Both indexes stay. Score-first ordering is still how the autoresponder and
-- the routing copy talk about triage, and the panel may want it back as an
-- option later.
CREATE INDEX IF NOT EXISTS idx_leads_created
  ON leads (created_at DESC);

-- Who did what, once they were inside.
--
-- Sign-in is Google's business and it keeps its own record. This is the other
-- half: Access-style login logs say who opened the door, and say nothing
-- about what happened next.
--
-- The row that matters is the export. Reading a lead in the panel leaves the
-- data where it is; a CSV moves the entire lead database onto somebody's
-- laptop, outside every control this application has, permanently. That is
-- the one action worth being able to reconstruct months later, so every
-- export is logged with the filter that produced it and the number of rows
-- it carried.
CREATE TABLE IF NOT EXISTS admin_audit (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,

  -- The verified address from the session. Never a display name, which is
  -- supplied by Google and is not unique.
  actor       TEXT NOT NULL,

  -- 'export' | 'status_change'
  action      TEXT NOT NULL,

  -- Row count and query for an export; old and new value for a status
  -- change. Deliberately free-form: the useful detail differs per action and
  -- a schema that anticipated all of them would be mostly empty columns.
  detail      TEXT,

  ip          TEXT,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_created
  ON admin_audit (created_at DESC);
