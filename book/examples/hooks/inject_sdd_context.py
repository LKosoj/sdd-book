#!/usr/bin/env python3
import json
import os
import re
import sys
from pathlib import Path


PROJECT_DIR = Path(os.environ.get("QWEN_PROJECT_DIR") or os.getcwd())


def exists(relative_path):
    return (PROJECT_DIR / relative_path).exists()


def looks_like_feature_work(prompt):
    return bool(
        re.search(
            r"(фич|реализ|добав|исправ|маршрут|страниц|миграц|тест|feature|implement|fix|route|migration|test)",
            prompt,
            re.IGNORECASE,
        )
    )


def build_context(payload):
    prompt = payload.get("prompt") or ""
    lines = []

    if exists("QWEN.md"):
        lines.append("- Перед изменением файлов проверь `QWEN.md`.")
    if exists("specs/mission.md"):
        lines.append("- Продуктовый смысл хранится в `specs/mission.md`.")
    if exists("specs/tech-stack.md"):
        lines.append("- Технические ограничения хранит `specs/tech-stack.md`.")
    if exists("specs/roadmap.md"):
        lines.append("- Порядок фаз хранит `specs/roadmap.md`.")
    if looks_like_feature_work(prompt):
        lines.append("- Для многофайловой фичи сначала найди или создай `requirements.md`, `plan.md` и `validation.md`.")

    if not lines:
        return ""

    return "# Короткий SDD-контекст\n" + "\n".join(lines)


def main():
    payload = json.loads(sys.stdin.read() or "{}")
    event_name = payload.get("hook_event_name", "UserPromptSubmit")
    context = build_context(payload)
    if not context:
        return

    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": event_name,
                    "additionalContext": context,
                }
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"inject_sdd_context: ошибка хука: {exc}", file=sys.stderr)
        sys.exit(1)
