#!/usr/bin/env python3
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


LOG_PATH = Path(os.environ.get("QWEN_HOOK_LOG", ".qwen/hooks/logs/tool-events.jsonl"))
MAX_TEXT = 2000


def clip(value):
    if value is None:
        return None
    if isinstance(value, str):
        text = value
    else:
        text = json.dumps(value, ensure_ascii=False, sort_keys=True)
    return text[:MAX_TEXT]


def main():
    payload = json.loads(sys.stdin.read() or "{}")
    record = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "session_id": payload.get("session_id"),
        "event": payload.get("hook_event_name"),
        "cwd": payload.get("cwd"),
        "tool_name": payload.get("tool_name"),
        "tool_input": clip(payload.get("tool_input")),
        "tool_response": clip(payload.get("tool_response")),
        "error": clip(payload.get("error")),
    }

    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with LOG_PATH.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, ensure_ascii=False, sort_keys=True) + "\n")

    print(json.dumps({"continue": True, "suppressOutput": True}, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"log_tool_result: ошибка хука: {exc}", file=sys.stderr)
        sys.exit(1)
