# Минимальный пример файлового арбитража

Этот пример демонстрирует контракт ролей Верификатор↔Имплементор из части 4 и
файловый протокол арбитража из части 8 без реального LLM-вызова. Все три скрипта работают
на Python stdlib через `python3` и читают только локальные файлы.

## Что проверяется

1. `scripts/run_duel.py` для каждого counterexample из `cases/` симулирует
   правило allowed_delta из spec и сравнивает реальный diagnostic_code с
   `expected_failure.diagnostic_code`.
2. `scripts/check_invariants.py` сверяет `metrics/validation_metrics.json`
   с anti-Goodhart порогами: `false_escalation_rate`, `silent_p0_ratio`,
   `rollback_flapping_per_hour`, `audit_trace_coverage`, `mttr_p95_minutes`.
3. `scripts/write_judgment.py` собирает финальный протокол решения по
   результатам двух предыдущих шагов.

## Запуск

Из каталога `book2/examples/tribunal`:

```bash
python3 scripts/run_duel.py \
  --spec specs/autoscale_spec.yaml \
  --cases cases/ \
  --out out/duel.json

python3 scripts/check_invariants.py \
  --metrics metrics/validation_metrics.json \
  --out out/invariants.json

python3 scripts/write_judgment.py \
  --duel-out out/duel.json \
  --invariants-out out/invariants.json \
  --to out/judgment.md
```

Сгенерированный `out/judgment.md` должен совпасть с `judgment.example.md`.

## Вердикты

- `PASS` — контрпример отклонён ожидаемым diagnostic_code и `allowed_delta`
  не превышает `executed_delta_upper_bound`.
- `FAIL` — контрпример прошёл проверку: Верификатор не нашёл нарушения, хотя
  должен был. Координатор блокирует merge.
- `DEFERRED` — Верификатор остановил действие, но диагностический код не совпал
  с ожиданием. Координатор переводит спор в ручное ревью без auto-merge.

## Формат counterexample

Каждый файл в `cases/` содержит `given_snapshot`, `when_payload`,
`minimality_trace` и `expected_failure`. Поле `minimality_trace` обязательно:
Верификатор должен показать, что без указанных условий нарушение исчезает.
