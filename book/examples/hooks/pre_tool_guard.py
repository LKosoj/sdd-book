#!/usr/bin/env python3
import json
import re
import sys


DANGEROUS_PATTERNS = [
    (r"\brm\s+-[^\n]*r[^\n]*f[^\n]*(/|~|\$HOME|\.)", "массовое удаление опасного пути"),
    (r"\bsudo\s+rm\b", "удаление через sudo"),
    (r"\bchmod\s+-R\s+777\b", "массовая выдача прав 777"),
    (r"\bgit\s+reset\s+--hard\b", "жёсткий сброс Git"),
    (r"\bgit\s+clean\s+-[^\n]*[fd][^\n]*[fd]\b", "массовая очистка неотслеживаемых файлов"),
    (r"\b(curl|wget)\b[^\n|]*\|\s*(sh|bash)\b", "запуск скачанного скрипта через shell"),
]


def tool_command(payload):
    tool_input = payload.get("tool_input")
    if isinstance(tool_input, dict):
        return str(tool_input.get("command") or tool_input.get("cmd") or tool_input)
    if tool_input is None:
        return ""
    return str(tool_input)


def allow(event_name):
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": event_name,
                    "permissionDecision": "allow",
                    "permissionDecisionReason": "Команда прошла базовую проверку.",
                }
            },
            ensure_ascii=False,
        )
    )


def main():
    payload = json.loads(sys.stdin.read() or "{}")
    event_name = payload.get("hook_event_name", "PreToolUse")

    if payload.get("tool_name") != "Bash":
        allow(event_name)
        return

    command = tool_command(payload)
    for pattern, reason in DANGEROUS_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            print(f"Хук безопасности остановил команду: {reason}.", file=sys.stderr)
            sys.exit(2)

    allow(event_name)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"pre_tool_guard: ошибка хука: {exc}", file=sys.stderr)
        sys.exit(1)
