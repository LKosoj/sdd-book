---
proposal_id: PROP-2026-05-20-003
type: amendment
target_rule_id: MUT-NO-AUDIT
action: add
fields:
  id: MUT-NO-AUDIT
  description: "Агент может выполнять действие без записи prompt_hash в аудит, если латентность критична."
  applies_to: "high_memory_usage"
  ttl: "2026-09-01"
  rollback_condition: "silent_p0_rate > 0.02"
  owner: "sre-team"
  evidence_ref: "validation.md#latency-tradeoff"
  conflicts_with_immutable: ["IMM-AUDIT"]
---

# Обоснование

Аудит съедает 12 мс на действие. Хотим временно отключить.
