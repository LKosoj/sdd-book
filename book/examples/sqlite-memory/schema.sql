PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  cwd TEXT,
  model TEXT,
  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  ended_at TEXT,
  last_dreamed_at TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  cwd TEXT,
  tool_name TEXT,
  prompt TEXT,
  tool_input_json TEXT,
  tool_response_text TEXT,
  assistant_message TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS memories (
  path TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  tags TEXT DEFAULT '',
  source TEXT DEFAULT 'dream',
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts
USING fts5(path, content, tags, content='memories', content_rowid='rowid');

CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories BEGIN
  INSERT INTO memory_fts(rowid, path, content, tags)
  VALUES (new.rowid, new.path, new.content, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories BEGIN
  INSERT INTO memory_fts(memory_fts, rowid, path, content, tags)
  VALUES('delete', old.rowid, old.path, old.content, old.tags);
END;

CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories BEGIN
  INSERT INTO memory_fts(memory_fts, rowid, path, content, tags)
  VALUES('delete', old.rowid, old.path, old.content, old.tags);
  INSERT INTO memory_fts(rowid, path, content, tags)
  VALUES (new.rowid, new.path, new.content, new.tags);
END;
