# Минимальный пример генератора стресс-спецификаций

Этот пример реализует фабрику мутаций из части 5: детерминированный мутатор
поверх корректного `base_spec.json`, sample-валидатор и подсчёт метрик
иммунитета. Все скрипты — Python stdlib через `python3`.

## Что проверяется

1. `scripts/mutate_specs.py` применяет операторы `Nullify`, `FutureTime`,
   `EscalationCycle`, `PriorityContradiction` к `base/base_spec.json` и
   пишет `manifest.json` + по одному JSON на мутанта. С тем же `--seed`
   список `mutation_id` стабилен.
2. `scripts/fake_validator.py` имитирует production-валидатор: required+тип,
   проверка времени, DFS на циклы графа эскалации, проверка реверса
   приоритетов без `tie_breaker`. Возвращает `diagnostic_code` и `halt_before`.
3. `scripts/immunity_score.py` сравнивает результаты валидатора с
   `expected/expected_failures.json` и считает `strict_reject_rate`,
   `depth_of_diagnostics`, `recovery_time_p95_ms`.

## Запуск

Из каталога `book2/examples/stress-mutator`:

```bash
python3 scripts/mutate_specs.py \
  --base base/base_spec.json \
  --seed 20260517 \
  --operators Nullify,FutureTime,EscalationCycle,PriorityContradiction \
  --out out/mutations

python3 scripts/fake_validator.py \
  --mutations out/mutations \
  --out out/validator_results.json

python3 scripts/immunity_score.py \
  --validator-results out/validator_results.json \
  --expected expected/expected_failures.json
```

Сгенерированный `out/mutations/manifest.json` совпадает с
`manifest.example.json` (контроль детерминизма).

## Как добавить новый оператор

1. В `scripts/mutate_specs.py` напишите функцию `op<Name>(spec, rnd): Mutation`,
   которая возвращает `operator`, `target_step`, `json_schema_rule`, `diff`
   и `mutated_spec`.
2. Зарегистрируйте её в словаре `OPERATORS`.
3. В `scripts/fake_validator.py` добавьте проверку, которая возвращает новый
   `diagnostic_code` и осмысленный `halt_before`.
4. В `expected/expected_failures.json` пропишите для оператора пару
   `diagnostic_code` + `halt_before`.

## Как читать diagnostic_code

`diagnostic_code` обязан показать класс отказа, а не общий `VALIDATION_FAILED`.
Например, `EMPTY_REQUIRED_FIELD` чинится JSON Schema, а `CYCLE_ESCALATION` —
дополнительным графовым правилом. Поле `halt_before` фиксирует шаг
`Given/When/Then`, до которого валидатор обязан остановиться, чтобы испорченный
вход не дошёл до исполнительной фазы.

## Пороги CI

- `strict_reject_rate >= 0.98` — почти все мутанты пойманы на ожидаемом шаге.
- `depth_of_diagnostics >= 3` — отчёт глубокий, а не «отказ без объяснения».
- `recovery_time_p95_ms <= 1200` — валидатор не тормозит pipeline.

Любой провал блокирует merge: рост строгости без глубины делает контур
«строже, но слепее».
