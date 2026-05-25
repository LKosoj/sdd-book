# Проверка — incident payload

## Набор фактов

### F1 — требования покрыты планом

- Команда: `python3 scripts/check_coverage.py --requirements requirements.md --plan plan.md`
- Ожидание: код выхода 0.

### F2 — JSON fixtures соответствуют схеме

- Команда: `python3 scripts/validate_schema.py --schema schemas/incident_payload.schema.json --fixtures fixtures`
- Ожидание: valid fixture принят, invalid fixture отклонён ожидаемой ошибкой.

