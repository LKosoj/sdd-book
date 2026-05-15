#!/usr/bin/env python3
"""
Каркас офлайн-обобщения памяти SQLite.

Вызов модели намеренно вынесен в отдельную функцию-адаптер. Подключите её
к выбранному провайдеру, а остальной поток записи оставьте стабильным.
"""

import argparse
import json
import os
import sqlite3
from datetime import datetime, timezone

DB_PATH = os.environ.get("QWEN_MEMORY_DB", ".qwen/memory/agent-memory.db")


def load_recent_events(db, limit):
    return db.execute(
        """
        SELECT session_id, event_name, timestamp, tool_name, prompt,
               tool_response_text, assistant_message
        FROM events
        ORDER BY id DESC
        LIMIT ?
        """,
        (limit,),
    ).fetchall()


def load_existing_memories(db):
    return db.execute(
        "SELECT path, content, tags FROM memories ORDER BY path"
    ).fetchall()


def summarize_with_llm(events, existing_memories):
    """
    Замените эту функцию реальным вызовом модели.

    Верните список словарей:
    [
      {"path": "workflow/sdd.md", "content": "...", "tags": "sdd,qwen"}
    ]
    """
    raise NotImplementedError("Подключите эту функцию к провайдеру модели.")


def upsert_memories(db, memories, source):
    now = datetime.now(timezone.utc).isoformat()
    for memory in memories:
        db.execute(
            """
            INSERT INTO memories(path, content, tags, source, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(path) DO UPDATE SET
              content = excluded.content,
              tags = excluded.tags,
              source = excluded.source,
              updated_at = excluded.updated_at
            """,
            (
                memory["path"],
                memory["content"],
                memory.get("tags", ""),
                source,
                now,
            ),
        )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=200)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    with sqlite3.connect(DB_PATH) as db:
        events = load_recent_events(db, args.limit)
        existing = load_existing_memories(db)
        memories = summarize_with_llm(events, existing)

        if args.dry_run:
            print(json.dumps(memories, indent=2, ensure_ascii=False))
            return

        upsert_memories(db, memories, source="dream")


if __name__ == "__main__":
    main()
