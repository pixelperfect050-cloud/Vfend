CREATE TABLE IF NOT EXISTS installations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id TEXT UNIQUE NOT NULL,
  team_name TEXT,
  bot_user_id TEXT,
  bot_token TEXT,
  bot_token_scopes TEXT,
  access_token TEXT,
  enterprise_id TEXT,
  installed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel_id TEXT UNIQUE NOT NULL,
  team_id TEXT NOT NULL,
  name TEXT,
  is_private INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  user_id TEXT,
  message_ts TEXT,
  event_type TEXT,
  payload TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_installations_team_id ON installations(team_id);
CREATE INDEX IF NOT EXISTS idx_conversations_channel_id ON conversations(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_team_id ON messages(team_id);