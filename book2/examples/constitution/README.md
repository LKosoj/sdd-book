# constitution

Runnable-аналог проверщика `scripts/constitution/check.py` из части 3.

## Что показывает

- что предложение поправки (proposal) обязательно несёт семь полей mutable-правила;
- что предложение не вступает в конфликт с `immutable_principles`;
- что `ttl` правила не превышает 90 дней и не лежит в прошлом.

## Состав

```
constitution/
├── specs/constitution.yaml             # учебная конституция
├── proposals/
│   ├── valid_proposal.md               # PASS
│   ├── missing_evidence.md             # BLOCK: нет evidence_ref
│   └── conflict_with_immutable.md      # BLOCK: затрагивает IMM-AUDIT
├── scripts/check.py                    # проверщик (stdlib only)
└── outputs/valid_verdict.example.json  # эталонный вывод
```

## Прогон

```bash
cd book2/examples/constitution

# PASS
python3 scripts/check.py \
  --constitution specs/constitution.yaml \
  --proposal proposals/valid_proposal.md \
  --out out/valid.json
diff -u outputs/valid_verdict.example.json out/valid.json

# BLOCK: пропущено evidence_ref
python3 scripts/check.py \
  --constitution specs/constitution.yaml \
  --proposal proposals/missing_evidence.md \
  || true   # exit code 1 ожидаем

# BLOCK: конфликт с immutable IMM-AUDIT
python3 scripts/check.py \
  --constitution specs/constitution.yaml \
  --proposal proposals/conflict_with_immutable.md \
  || true
```

## Границы примера

Проверщик не валидирует YAML-схемой и не понимает сложный YAML —
он покрывает только тот синтаксис, который встречается в учебных файлах.
В реальном проекте используйте JSON Schema или `pyyaml` с явной схемой.

Это `[runnable]`-аналог, а не готовый production-инструмент: учебный
минимум главы 3 закрывается тремя сценариями PASS/BLOCK/BLOCK.
