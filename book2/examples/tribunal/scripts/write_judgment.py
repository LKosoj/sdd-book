#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any


def render_value(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def render(duel: dict[str, Any], inv: dict[str, Any]) -> str:
    lines: list[str] = []
    lines.append(f"# Протокол файлового арбитража — {duel.get('spec_id') or 'unknown_spec'}")
    lines.append("")
    lines.append(f"Сессия: {inv.get('session_id') or 'n/a'}")
    lines.append(f"Окно: {inv.get('window') or 'n/a'}")
    lines.append("")
    lines.append("## Раунд 1. Дуэль Верификатора против Имплементора")
    lines.append("")
    lines.append(f"Total: {duel['total']}, PASS: {duel['pass']}, FAIL: {duel['fail']}, DEFERRED: {duel['deferred']}")
    lines.append("")

    for row in duel["results"]:
        lines.append(f"### {row['counterexample_id']} — {row['verdict']}")
        lines.append("")
        lines.append(f"- assertion: `{row['assertion_id']}`")
        lines.append(f"- expected diagnostic_code: `{render_value(row['expected'].get('diagnostic_code'))}`")
        lines.append(f"- actual diagnostic_code: `{render_value(row['actual'].get('diagnostic_code'))}`")
        lines.append(f"- allowed_delta={row['actual']['allowed_delta']}, requested_delta={row['actual']['requested_delta']}")
        for reason in row["reasons"]:
            lines.append(f"- расхождение: {reason}")
        lines.append("")

    lines.append("## Раунд 2. Anti-Goodhart инварианты")
    lines.append("")
    lines.append(f"Verdict: **{inv['verdict']}**, нарушено порогов: {inv['failed']}")
    lines.append("")
    lines.append("| metric | value | op | threshold | status |")
    lines.append("|---|---|---|---|---|")
    for check in inv["checks"]:
        status = "OK" if check["ok"] else "FAIL"
        lines.append(f"| {check['metric']} | {render_value(check['value'])} | {check['op']} | {render_value(check['threshold'])} | {status} |")
    lines.append("")

    overall = "PASS" if duel["fail"] == 0 and inv["verdict"] == "PASS" else "FAIL"
    if overall == "PASS" and duel["deferred"] > 0:
        overall = "DEFERRED"

    lines.append("## Итоговый вердикт")
    lines.append("")
    lines.append(f"**{overall}**")
    lines.append("")
    if overall == "FAIL":
        lines.append("Координатор блокирует merge: либо counterexample прошёл, либо нарушен anti-Goodhart порог.")
    elif overall == "DEFERRED":
        lines.append("Координатор переводит спор в manual-review: контрпример требует уточнения assertion или политики разрешения.")
    else:
        lines.append("Координатор подтверждает результат: контрпримеры отклонены ожидаемо, anti-Goodhart инварианты соблюдены.")
    lines.append("")
    return "\n".join(lines)


def parse_args() -> dict[str, str]:
    args: dict[str, str] = {}
    argv = sys.argv[1:]
    if len(argv) % 2:
        usage()
    for i in range(0, len(argv), 2):
        key = argv[i].removeprefix("--")
        value = argv[i + 1]
        if not key:
            usage()
        args[key] = value
    if "duel-out" not in args or "invariants-out" not in args or "to" not in args:
        usage()
    return args


def usage() -> None:
    print("usage: write_judgment.py --duel-out <path> --invariants-out <path> --to <path>", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    duel = json.loads(Path(args["duel-out"]).read_text(encoding="utf-8"))
    inv = json.loads(Path(args["invariants-out"]).read_text(encoding="utf-8"))
    out_path = Path(args["to"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(render(duel, inv), encoding="utf-8")
    print(f"judgment written to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
