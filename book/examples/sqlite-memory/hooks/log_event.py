#!/usr/bin/env python3
import json
import os
import sqlite3
import sys

DB_PATH = os.environ.get("QWEN_MEMORY_DB", ".qwen/memory/agent-memory.db")
MAX_TEXT = 4000


def clip(value):
    if value is None:
        return None
    text = value if isinstance(value, str) else json.dumps(value, ensure_ascii=False)
    return text[:MAX_TEXT]


def main():
    raw = sys.stdin.read()
    payload = json.loads(raw) if raw.strip() else {}

    session_id = payload.get("session_id", "unknown")
    event_name = payload.get("hook_event_name", "unknown")

    with sqlite3.connect(DB_PATH) as db:
        db.execute("PRAGMA journal_mode = WAL")
        db.execute(
            """
            INSERT INTO sessions(id, cwd, model)
            VALUES (?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              cwd = COALESCE(excluded.cwd, sessions.cwd),
              model = COALESCE(excluded.model, sessions.model)
            """,
            (session_id, payload.get("cwd"), payload.get("model")),
        )
        db.execute(
            """
            INSERT INTO events(
              session_id, event_name, cwd, tool_name, prompt,
              tool_input_json, tool_response_text, assistant_message
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                session_id,
                event_name,
                payload.get("cwd"),
                payload.get("tool_name"),
                payload.get("prompt"),
                clip(payload.get("tool_input")),
                clip(payload.get("tool_response") or payload.get("error")),
                clip(payload.get("last_assistant_message")),
            ),
        )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"хук памяти log_event: ошибка: {exc}", file=sys.stderr)
