# Шаблон поправки в конституцию
<!-- Шаблон для главы 3 / book2/part-03-project-constitution.md -->
<!-- Каждая поправка проходит как отдельный файл proposal.md в каталоге   -->
<!-- changes/. После принятия она сшивается с предыдущей версией через    -->
<!-- parent_version и decision_hash.                                       -->

## Идентификация

- version: `<vN+1, увеличивается на 1 от parent_version>`
- parent_version: `<vN, версия конституции, к которой добавляется поправка>`
- proposed_at: `<YYYY-MM-DDThh:mm:ssZ>`
- proposed_by: `<роль или агент>`

## Контекст инцидента

- incident_context:
  - `<какой повторяющийся unknown-инцидент или конфликт привёл к поправке>`
  - `<ссылка на judgment.md session_id или precedents.md id>`

## Содержание

- reason: `<2–4 предложения: какую проблему решает поправка>`
- change_summary: `<какое правило добавляется, изменяется или удаляется>`

## Голосование

- coordinator: `<имя или агент; ведёт процедуру, но не голосует>`
- votes:
  - role: `Верификатор`
    agent: `<...>`
    vote: `<...>`  # одно из: yes, no, abstain
  - role: `Имплементор`
    agent: `<...>`
    vote: `<...>`
  - role: `Safety`
    agent: `<...>`
    vote: `<...>`  # `no` от Safety = veto независимо от остальных голосов
- pass_rule: `at_least_2_approve_and_no_safety_veto`
- quorum_required: `<число голосов, необходимое для принятия>`
- decision: `accepted`  # одно из: accepted, rejected, deferred

## Активация и откат

- decision_hash: `<sha256 от утверждённого текста>`
- activation_time: `<YYYY-MM-DDThh:mm:ssZ — момент, когда поправка вступает в силу>`
- ttl: `<например, 30d, либо permanent>`
- rollback_condition: `<формальное условие, при котором поправка откатывается автоматически>`
