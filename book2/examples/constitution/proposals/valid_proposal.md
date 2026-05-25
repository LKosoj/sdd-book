---
proposal_id: PROP-2026-05-20-001
type: amendment
target_rule_id: MUT-RESTART-POD-V2
action: add
fields:
  id: MUT-RESTART-POD-V2
  description: "Агенту разрешено перезапустить под после ручного approve в Slack, если RSS > 90% дольше 5 минут."
  applies_to: "high_memory_usage"
  ttl: "2026-08-15"
  rollback_condition: "silent_p0_rate > 0.02 in 24h OR manual_approve_latency > 15min"
  owner: "sre-team"
  evidence_ref: "validation.md#restart-pod-with-approve"
---

# Обоснование

Добавляется ручной шлюз approve перед перезапуском пода. Не нарушает immutable-принципы:
- IMM-AUDIT остаётся: approve пишется в аудит-след;
- IMM-SILENT-P0 не затрагивается;
- IMM-BLAST не расширяется.
