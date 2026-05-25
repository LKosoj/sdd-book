# Шаблон genealogy.md
<!-- Шаблон для главы 1 / book2/part-01-spec-archaeology.md -->
<!-- Провенанс-журнал восстановленных требований. Заполняется на этапе      -->
<!-- spec-археологии, обновляется при каждой ревизии источников.            -->

## Метаданные

- document_id: `<уникальный идентификатор журнала>`
- spec_version: `<версия spec, к которой относится этот журнал>`
- maintained_by: `<команда или роль владельца>`
- last_review: `<YYYY-MM-DD>`

## Записи

### REQ-001

- req_id: `REQ-001`
- statement: `<формулировка требования в формате WHEN ... THE SYSTEM SHALL ...>`
- source:
  - logs: `<ссылка на evidence/timeline.ndjson строку или диапазон ts>`
  - slack: `<ссылка на тред или сообщение, либо null>`
  - metrics: `<ссылка на CSV/PromQL, либо null>`
  - postmortem: `<ссылка на документ постмортема, либо null>`
- status: `approved`  # одно из: approved, needs_clarity, rejected, draft
- adjudicated_by: `<роль или агент, утвердивший статус>`
- uncertainty: `low`  # одно из: low, medium, high
- open_questions:
  - `<вопрос 1, который нужно задать владельцу сервиса>`
  - `<вопрос 2, если есть>`

### REQ-002

- req_id: `REQ-002`
- statement: `<...>`
- source:
  - logs: `<...>`
  - slack: `<...>`
  - metrics: `<...>`
  - postmortem: `<...>`
- status: `needs_clarity`
- adjudicated_by: `<...>`
- uncertainty: `medium`
- open_questions:
  - `<...>`
