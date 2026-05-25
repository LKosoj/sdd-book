#!/usr/bin/env python3
"""Минимальный проверщик предложения поправки к конституции.

Не использует внешних зависимостей. YAML парсится упрощённо
(только нужный подмножество: списки `- key: value` и плоские поля),
чтобы пример работал без `pip install pyyaml`.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

REQUIRED_FIELDS = (
    "id",
    "description",
    "applies_to",
    "ttl",
    "rollback_condition",
    "owner",
    "evidence_ref",
)

MAX_TTL_DAYS = 90


def parse_simple_yaml(text: str) -> dict:
    """Парсит YAML с конституцией. Поддерживает достаточно для учебного примера."""
    root: dict = {}
    stack: list[tuple[int, object]] = [(-1, root)]
    pending_list_item: dict | None = None
    pending_list_indent: int = -1

    for raw in text.splitlines():
        if not raw.strip() or raw.strip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip(" "))
        line = raw.strip()

        if line.startswith("- "):
            body = line[2:]
            while stack and stack[-1][0] >= indent:
                stack.pop()
            container = stack[-1][1]
            if not isinstance(container, list):
                raise ValueError(f"список ожидался, но найден словарь у строки: {raw!r}")
            item: dict = {}
            container.append(item)
            pending_list_item = item
            pending_list_indent = indent
            if ":" in body:
                key, _, value = body.partition(":")
                item[key.strip()] = _scalar(value.strip())
            continue

        if ":" in line:
            key, _, value = line.partition(":")
            key = key.strip()
            value = value.strip()

            if pending_list_item is not None and indent > pending_list_indent:
                container = pending_list_item
            else:
                pending_list_item = None
                while stack and stack[-1][0] >= indent:
                    stack.pop()
                container = stack[-1][1]

            if value == "":
                new_container: list | dict
                new_container = [] if _looks_like_list_key(key) else {}
                container[key] = new_container
                stack.append((indent, new_container))
            else:
                container[key] = _scalar(value)

    return root


def _looks_like_list_key(key: str) -> bool:
    return key in {"immutable_principles", "mutable_rules", "conflicts_with_immutable"}


def _scalar(value: str):
    if value.startswith('"') and value.endswith('"'):
        return value[1:-1]
    if value.startswith("[") and value.endswith("]"):
        inner = value[1:-1].strip()
        if not inner:
            return []
        return [_scalar(p.strip()) for p in inner.split(",")]
    try:
        return int(value)
    except ValueError:
        return value


def parse_frontmatter(text: str) -> dict:
    match = re.match(r"^---\n(.*?)\n---", text, flags=re.DOTALL)
    if not match:
        raise ValueError("в предложении нет YAML-frontmatter")
    return parse_simple_yaml(match.group(1))


def check(constitution: dict, proposal: dict) -> dict:
    blockers: list[str] = []

    fields = proposal.get("fields", {})
    if not isinstance(fields, dict):
        blockers.append("fields: ожидался словарь")
        return _verdict(blockers, proposal)

    for required in REQUIRED_FIELDS:
        if required not in fields or fields[required] in ("", None):
            blockers.append(f"missing_field: {required}")

    ttl = fields.get("ttl")
    if isinstance(ttl, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", ttl):
        try:
            ttl_date = date.fromisoformat(ttl)
            today = date.fromisoformat(proposal.get("today", "2026-05-20"))
            delta = (ttl_date - today).days
            if delta > MAX_TTL_DAYS:
                blockers.append(f"ttl_too_long: {delta} days > {MAX_TTL_DAYS}")
            if delta <= 0:
                blockers.append("ttl_in_past")
        except ValueError:
            blockers.append(f"ttl_invalid: {ttl}")

    immutable_ids = {
        p.get("id") for p in constitution.get("immutable_principles", []) if isinstance(p, dict)
    }
    conflicts = fields.get("conflicts_with_immutable", []) or []
    if not isinstance(conflicts, list):
        conflicts = [conflicts]
    for cid in conflicts:
        if cid in immutable_ids:
            blockers.append(f"conflicts_with_immutable: {cid}")

    return _verdict(blockers, proposal)


def _verdict(blockers: list[str], proposal: dict) -> dict:
    return {
        "proposal_id": proposal.get("proposal_id", "unknown"),
        "verdict": "PASS" if not blockers else "BLOCK",
        "blockers": blockers,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--constitution", required=True)
    ap.add_argument("--proposal", required=True)
    ap.add_argument("--out")
    ap.add_argument("--today", default="2026-05-20")
    args = ap.parse_args()

    constitution = parse_simple_yaml(Path(args.constitution).read_text(encoding="utf-8"))
    proposal = parse_frontmatter(Path(args.proposal).read_text(encoding="utf-8"))
    proposal["today"] = args.today

    result = check(constitution, proposal)
    payload = json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True)

    if args.out:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.out).write_text(payload + "\n", encoding="utf-8")

    print(payload)
    return 0 if result["verdict"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
