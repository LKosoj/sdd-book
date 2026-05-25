# План — incident payload

## Группа 1 — контракт входного события

TASK-001 implements: [REQ-001]
Добавить обязательное поле `incident_id` в JSON Schema.

TASK-002 implements: [REQ-002]
Ограничить `severity` перечислением `P0`, `P1`, `P2`, `P3`.

TASK-003 implements: [REQ-003]
Потребовать `service`, `source` и `received_at`.

## Группа 2 — проверка

TASK-004 implements: [REQ-001, REQ-002, REQ-003]
Добавить valid fixture и invalid fixture для schema-check.

