# Шаблон протокола файлового арбитража
<!-- Шаблон для главы 8 / book2/part-08-multiagent-tribunal.md -->
<!-- Используется для каждой сессии файлового арбитража спорного изменения. -->
<!-- Не редактировать задним числом: это аудиторский артефакт.             -->

## Шапка

- session_id: `<например, incident-lab-2026-05-17-001>`
- spec_version: `<хеш или версия spec, по которой шёл разбор>`
- opened_at: `<YYYY-MM-DDThh:mm:ssZ>`
- closed_at: `<YYYY-MM-DDThh:mm:ssZ или null, если сессия открыта>`
- coordinator: `<роль или модель>`
- participants:
  - role: `Верификатор`
    agent: `<имя или модель>`
  - role: `Имплементор`
    agent: `<...>`
  - role: `Safety`
    agent: `<...>`

## Раунды

### round 1

- round_id: `R1`
- role: `Имплементор`
- action: `proposed`  # одно из: proposed, challenged, defended, deferred, withdrawn
- summary: `<краткое описание предложения>`
- evidence_ref:
  - `<ссылка на artifact, log или diff>`
  - `<...>`

### round 2

- round_id: `R2`
- role: `Верификатор`
- action: `challenged`
- summary: `<какой инвариант проверялся и какой контрпример найден>`
- evidence_ref:
  - `<...>`

### round 3

- round_id: `R3`
- role: `Координатор`
- action: `<...>`
- summary: `<...>`
- evidence_ref:
  - `<...>`

## Решение

- final_verdict: `accepted`  # одно из: accepted, rejected, deferred, partial
- verdict_rationale: `<обоснование на 2–4 предложения>`
- linked_precedents:
  - `<id прецедента из precedents.md, если применимо>`

## Отложенные пункты

- deferred_items:
  - id: `D1`
    description: `<что осталось нерешённым>`
    owner: `<кому передано>`
    due: `<YYYY-MM-DD>`
