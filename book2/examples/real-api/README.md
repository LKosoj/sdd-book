# Минимальный runnable-пример для части 11

Этот пример — маленький локальный аналог конвейера `webhook → normalize → specify → readiness gate` из части 11. Без внешних зависимостей и без поднятия Kubernetes; всё работает на Python stdlib через `python3` и нескольких fixture-файлах.

## Что показывает пример

1. **Нормализацию вебхука.** `scripts/normalize_webhook.py` сводит сырой payload Grafana/PagerDuty к единому `incident_event.json` с полями `incident_id`, `service`, `namespace`, `pod`, `severity`, `window_minutes`, `metric_context`, `source_refs`.
2. **Шлюз готовности по 25-балльной модели из части 11.** `scripts/check_readiness.py` читает заполненную карту готовности и решает, допущена ли ремедиация: порог 23/25, плюс жёсткие блокирующие условия (`audit_trace_coverage == 1.0`, `backup_verified == true` для stateful).
3. **Связь spec→action.** Скрипт `scripts/dry_run.py` проверяет, что заявленный `pre_approved_action` действительно перечислен в файле спецификации `specs/high_memory_usage/specify.md` (демо-файл лежит здесь же).

## Структура

- `fixtures/webhook_grafana.json` — сырой alert Grafana о росте `memory_percent`.
- `fixtures/webhook_pagerduty.json` — сырой инцидент PagerDuty с тем же ID.
- `fixtures/incident_event.expected.json` — эталонный нормализованный event.
- `fixtures/readiness_pass.json` — заполненная карта 24/25, должно пройти.
- `fixtures/readiness_block_audit.json` — 22/25 с провалом по audit; должно заблокироваться.
- `fixtures/readiness_block_stateful.json` — 24/25, но `backup_verified=false` для stateful; должно заблокироваться.
- `specs/high_memory_usage/specify.md` — демонстрационная spec с pre-approved actions.

## Запуск

Из каталога `book2/examples/real-api`:

```bash
python3 scripts/normalize_webhook.py \
  --grafana fixtures/webhook_grafana.json \
  --pagerduty fixtures/webhook_pagerduty.json \
  --expected fixtures/incident_event.expected.json

python3 scripts/check_readiness.py --readiness fixtures/readiness_pass.json

# Ожидаемые BLOCK-проверки: команды возвращают exit code 1.
python3 scripts/check_readiness.py --readiness fixtures/readiness_block_audit.json
python3 scripts/check_readiness.py --readiness fixtures/readiness_block_stateful.json

python3 scripts/dry_run.py \
  --spec specs/high_memory_usage/specify.md \
  --action restart_pod

# Ожидаемый BLOCK: действие не входит в pre-approved actions.
python3 scripts/dry_run.py \
  --spec specs/high_memory_usage/specify.md \
  --action delete_namespace
```

Скрипты возвращают exit code 0 при PASS и 1 при FAIL/BLOCK. Это и есть смысл шлюза: pre-merge job ломается, если готовность ниже порога или заявленное действие не описано в spec.

## Как использовать с Qwen Code

Qwen Code можно попросить объяснить отчёт или предложить, как заполнить пробелы в карте готовности, но решение о допуске должно зависеть от скриптов:

```bash
qwen -p "Прочитай @fixtures/readiness_block_audit.json и @specs/high_memory_usage/specify.md.
Что нужно дополнить, чтобы готовность достигла 23/25? Файлы не меняй." \
  --approval-mode plan
```

## Что НЕ показывает пример

- Реальный деплой и откат. В production эти шаги делает GitOps; здесь только проверяется, что условие для них выполнено.
- Полную интеграцию с Grafana/PagerDuty webhook. Здесь только нормализатор формата.
- Дуэль Верификатор/Имплементор — для неё используйте `book2/examples/tribunal/`.
