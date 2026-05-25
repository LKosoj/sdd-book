# Минимальный пример Spec CI

Этот пример показывает, как сделать маленький проверяемый слой вокруг `requirements.md`, `plan.md` и JSON payload-ов без вымышленных команд Qwen Code.

## Что проверяется

1. `scripts/check_coverage.py` проверяет, что каждый `REQ-*` из `requirements.md` реализуется хотя бы одной задачей из `plan.md`.
2. `scripts/validate_schema.py` проверяет JSON fixtures против минимальной схемы `schemas/incident_payload.schema.json`.

## Запуск

Из каталога `book2/examples/spec-ci`:

```bash
python3 scripts/check_coverage.py --requirements requirements.md --plan plan.md
python3 scripts/validate_schema.py --schema schemas/incident_payload.schema.json --fixtures fixtures
```

Обе команды должны завершиться с кодом 0. Отрицательный пример `fixtures/invalid-missing-incident-id.json` считается успешным только если он отклонён схемой.

## Как использовать с Qwen Code

Qwen Code можно попросить объяснить отчёт или предложить исправление, но gate должен зависеть от скриптов:

```bash
qwen -p "Прочитай @requirements.md, @plan.md и вывод Spec CI. Объясни, что нужно исправить. Файлы не меняй." --approval-mode plan
```
