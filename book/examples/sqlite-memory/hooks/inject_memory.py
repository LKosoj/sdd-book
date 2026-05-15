#!/usr/bin/env python3
import json
import os
import re
import sqlite3
import sys

DB_PATH = os.environ.get("QWEN_MEMORY_DB", ".qwen/memory/agent-memory.db")
LIMIT = 5
STOPWORDS = {
    "this",
    "that",
    "with",
    "from",
    "what",
    "when",
    "where",
    "please",
    "code",
    "file",
}


def terms(text):
    words = re.findall(r"[0-9A-Za-zА-Яа-яЁё_-]{3,}", text.lower())
    return [word for word in words if word not in STOPWORDS][:12]


def session_context(db):
    return db.execute(
        """
        SELECT path, content
        FROM memories
        WHERE path LIKE 'profile/%' OR path LIKE 'project/%'
        ORDER BY updated_at DESC
        LIMIT ?
        """,
        (LIMIT,),
    ).fetchall()


def prompt_context(db, prompt):
    query_terms = terms(prompt)
    if not query_terms:
        return []

    fts_query = " OR ".join(query_terms)
    return db.execute(
        """
        SELECT m.path, m.content
        FROM memory_fts f
        JOIN memories m ON m.rowid = f.rowid
        WHERE memory_fts MATCH ?
        LIMIT ?
        """,
        (fts_query, LIMIT),
    ).fetchall()


def emit(event_name, rows):
    if not rows:
        return

    parts = ["# Релевантная память SQLite\n"]
    for path, content in rows:
        parts.append(f"## {path}\n{content}\n")

    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": event_name,
                    "additionalContext": "\n".join(parts),
                }
            },
            ensure_ascii=False,
        )
    )


def main():
    payload = json.loads(sys.stdin.read() or "{}")
    event = payload.get("hook_event_name", "")

    with sqlite3.connect(DB_PATH) as db:
        if event == "SessionStart":
            emit(event, session_context(db))
        elif event == "UserPromptSubmit":
            emit(event, prompt_context(db, payload.get("prompt", "")))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"хук памяти inject_memory: ошибка: {exc}", file=sys.stderr)
