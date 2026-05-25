---
proposal_id: PROP-2026-05-20-002
type: amendment
target_rule_id: MUT-RESTART-POD-V3
action: add
fields:
  id: MUT-RESTART-POD-V3
  description: "Агент перезапускает под без подтверждения, если RSS > 85%."
  applies_to: "high_memory_usage"
  ttl: "2026-09-01"
  rollback_condition: "silent_p0_rate > 0.02"
  owner: "sre-team"
---

# Обоснование

Хотим ускорить ремедиацию. Доказательство добавим позже.
