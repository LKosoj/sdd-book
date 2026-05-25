# Шаблон precedents.md
<!-- Шаблон для главы 8 / book2/part-08-multiagent-tribunal.md -->
<!-- Список прецедентов, на которые файловый арбитраж ссылается при        -->
<!-- спорах. Прецедент создаётся только после закрытой сессии judgment.md  -->
<!-- с явной формулировкой триггера. Канонические пять полей —             -->
<!-- case_id / verdict / evidence_ref / applies_to / next_check.           -->

## PREC-001

- case_id: `PREC-001`
- verdict: `<APPROVE | DENY | DEFERRED>`
- evidence_ref: `<ссылка на session_id из judgment.md, артефакт, replay или метрику>`
- applies_to: `<область, ярус и режим: например, "rate-limit без дедупликации tenant_id, все ярусы, strict_guardrails_prompt">`
- next_check: `<условие, при котором прецедент пересматривается>`

## PREC-002

- case_id: `PREC-002`
- verdict: `<...>`
- evidence_ref: `<...>`
- applies_to: `<...>`
- next_check: `<...>`

## PREC-003

- case_id: `PREC-003`
- verdict: `<...>`
- evidence_ref: `<...>`
- applies_to: `<...>`
- next_check: `<...>`
