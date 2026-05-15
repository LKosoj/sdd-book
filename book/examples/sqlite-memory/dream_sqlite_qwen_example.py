#!/usr/bin/env python3
"""
Working example of the SQLite dream pass using the same OpenAI-compatible
endpoint that the textbook configures in part 4 for Qwen Code itself.

This is the rest-of-the-owl for dream_sqlite_skeleton.py: it wires the LLM
adapter to a Qwen / DashScope OpenAI-compatible endpoint so you can run the
consolidation pass against the same backend you already authenticated for
day-to-day SDD work.

Move this file to examples/sqlite-memory/ next to dream_sqlite_skeleton.py.

Environment:
  BAILIAN_API_KEY   API key for DashScope / Alibaba Cloud Coding Plan.
  QWEN_DREAM_MODEL  Optional. Defaults to qwen3-coder-plus.
  QWEN_DREAM_URL    Optional. Defaults to the international DashScope endpoint.
  QWEN_MEMORY_DB    Optional. Defaults to .qwen/memory/agent-memory.db.

Usage:
  python dream_sqlite_qwen_example.py --since 24h --dry-run
  python dream_sqlite_qwen_example.py --since 24h
"""

import argparse
import json
import os
import sqlite3
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone

DB_PATH = os.environ.get("QWEN_MEMORY_DB", ".qwen/memory/agent-memory.db")
API_URL = os.environ.get(
    "QWEN_DREAM_URL",
    "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
)
API_MODEL = os.environ.get("QWEN_DREAM_MODEL", "qwen3-coder-plus")

SYSTEM_PROMPT = """You are a memory consolidator for a SDD coding workflow.

Read raw session events and existing memory notes. Produce 0-5 compact memory
entries that capture stable, generalizable lessons: user preferences, recurring
mistakes, validated commands, project conventions. Do NOT include secrets,
session-specific noise, or one-off debugging steps.

Output STRICT JSON: an array of objects with keys path, content, tags.
Paths use this taxonomy:
  profile/...   stable user preferences
  project/...   project-specific facts
  workflow/...  SDD process notes
  tools/...     tool-specific tips (qwen-code, git, sqlite)

Keep each content under 400 characters. Use tags as a comma-separated string.
If nothing is worth saving, return [].
"""


def parse_since(value):
    if value.endswith("h"):
        hours = int(value[:-1])
        return datetime.now(timezone.utc) - timedelta(hours=hours)
    if value.endswith("d"):
        days = int(value[:-1])
        return datetime.now(timezone.utc) - timedelta(days=days)
    raise ValueError(f"unsupported --since format: {value} (use 24h or 7d)")


def load_recent_events(db, since_iso, limit):
    return db.execute(
        """
        SELECT session_id, event_name, timestamp, tool_name, prompt,
               tool_response_text, assistant_message
        FROM events
        WHERE timestamp >= ?
        ORDER BY id DESC
        LIMIT ?
        """,
        (since_iso, limit),
    ).fetchall()


def load_existing_memories(db):
    return db.execute(
        "SELECT path, content, tags FROM memories ORDER BY path"
    ).fetchall()


def call_model(prompt):
    api_key = os.environ.get("BAILIAN_API_KEY")
    if not api_key:
        raise RuntimeError("BAILIAN_API_KEY is not set")

    payload = {
        "model": API_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2,
    }
    request = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"model HTTP {exc.code}: {exc.read().decode('utf-8')[:200]}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"model call failed: {exc}") from exc

    choices = body.get("choices") or []
    if not choices:
        return ""
    return choices[0].get("message", {}).get("content", "")


def summarize_with_llm(events, existing_memories):
    events_view = [
        {
            "session": e[0],
            "event": e[1],
            "ts": e[2],
            "tool": e[3],
            "prompt": (e[4] or "")[:400],
            "response": (e[5] or "")[:400],
            "assistant": (e[6] or "")[:400],
        }
        for e in events
    ]
    existing_view = [
        {"path": m[0], "content": m[1][:400], "tags": m[2]} for m in existing_memories
    ]
    user_prompt = json.dumps(
        {"existing_memories": existing_view, "recent_events": events_view},
        ensure_ascii=False,
    )
    raw = call_model(user_prompt)

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        print(f"warning: model returned non-JSON, skipping: {raw[:200]}", file=sys.stderr)
        return []

    if isinstance(parsed, dict):
        memories = parsed.get("memories") or parsed.get("items") or []
    elif isinstance(parsed, list):
        memories = parsed
    else:
        memories = []

    return [m for m in memories if isinstance(m, dict) and "path" in m and "content" in m]


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
    parser.add_argument("--since", default="24h", help="window: 24h, 7d, ...")
    parser.add_argument("--limit", type=int, default=200)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    since_iso = parse_since(args.since).isoformat()

    with sqlite3.connect(DB_PATH) as db:
        events = load_recent_events(db, since_iso, args.limit)
        existing = load_existing_memories(db)

        if not events:
            print("no events in window, nothing to consolidate", file=sys.stderr)
            return

        memories = summarize_with_llm(events, existing)

        if args.dry_run or not memories:
            print(json.dumps(memories, indent=2, ensure_ascii=False))
            return

        upsert_memories(db, memories, source="dream-qwen")
        print(f"upserted {len(memories)} memories", file=sys.stderr)


if __name__ == "__main__":
    main()
