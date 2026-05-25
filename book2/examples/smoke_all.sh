#!/usr/bin/env bash
set -euo pipefail

src_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
work_dir="$(mktemp -d)"
trap 'rm -rf "$work_dir"' EXIT

cp -a "$src_dir" "$work_dir/examples"
cd "$work_dir/examples"

python3 -m compileall -q .

expect_fail() {
  if "$@"; then
    echo "expected failure, but command passed: $*" >&2
    exit 1
  fi
}

(
  cd constitution
  python3 scripts/check.py --constitution specs/constitution.yaml --proposal proposals/valid_proposal.md --out out/valid.json
  diff -u outputs/valid_verdict.example.json out/valid.json
  expect_fail python3 scripts/check.py --constitution specs/constitution.yaml --proposal proposals/missing_evidence.md
  expect_fail python3 scripts/check.py --constitution specs/constitution.yaml --proposal proposals/conflict_with_immutable.md
)

(
  cd spec-ci
  python3 scripts/check_coverage.py --requirements requirements.md --plan plan.md
  python3 scripts/validate_schema.py --schema schemas/incident_payload.schema.json --fixtures fixtures
)

(
  cd tribunal
  python3 scripts/run_duel.py --spec specs/autoscale_spec.yaml --cases cases/ --out out/duel.json
  python3 scripts/check_invariants.py --metrics metrics/validation_metrics.json --out out/invariants.json
  python3 scripts/write_judgment.py --duel-out out/duel.json --invariants-out out/invariants.json --to out/judgment.md
  diff -u judgment.example.md out/judgment.md
  expect_fail python3 scripts/matrix.py --spec specs/autoscale_spec.yaml --cases cases/ --tiers matrix/tiers.json --out out/matrix.json
  diff -u matrix/matrix.example.json out/matrix.json
)

(
  cd stress-mutator
  python3 scripts/mutate_specs.py --base base/base_spec.json --seed 20260517 --operators Nullify,FutureTime,EscalationCycle,PriorityContradiction --out out/mutations
  diff out/mutations/manifest.json manifest.example.json
  python3 scripts/fake_validator.py --mutations out/mutations --out out/validator_results.json
  python3 scripts/immunity_score.py --validator-results out/validator_results.json --expected expected/expected_failures.json
)

(
  cd shadow-auction
  python3 scripts/score.py --candidates candidates/candidates.yaml --incidents data/incidents.jsonl --weights 0.5,0.3,0.2,0.4 --out out/scorebook.json
  python3 scripts/decide.py --scorebook out/scorebook.json --budget-tokens 2000 --keep-threshold 0.70 --reject-threshold 0.40 --out-auction out/auction.json --out-quarantine out/quarantine.json
  python3 scripts/write_qwen_block.py --auction out/auction.json --target-anchor "QWEN.md#incident-triage-shadow" --today 2026-05-17 --out out/qwen_block.md
  diff -u outputs/scorebook.example.json out/scorebook.json
  diff -u outputs/auction.example.json out/auction.json
  diff -u outputs/quarantine.example.json out/quarantine.json
  diff -u outputs/qwen_block.example.md out/qwen_block.md
)

(
  cd budget-keeper
  python3 scripts/compile.py --budget-spec specs/budget_network.yaml --out out/budget_plan.json
  diff -u outputs/budget_plan.example.json out/budget_plan.json
  python3 scripts/simulate.py --plan out/budget_plan.json --scenario scenarios/fail_local_45m.json --out out/fail_result.json
  diff -u outputs/fail_result.example.json out/fail_result.json
  python3 scripts/inspect.py --result out/fail_result.json --query "failover_to_frontier==5 && degraded_queue==15 && manual_queue_after_120s==15 && token_health_min>=0.5"
  python3 scripts/simulate.py --plan out/budget_plan.json --scenario scenarios/fail_local_15m.json --out out/fail_15m_result.json
  python3 scripts/inspect.py --result out/fail_15m_result.json --query "token_health_min>=0.7"
  python3 scripts/compile.py --budget-spec specs/budget_network_5m.yaml --out out/budget_plan_5m.json
  python3 scripts/simulate.py --plan out/budget_plan_5m.json --scenario scenarios/fail_local_45m.json --out out/fail_result_5m.json
  python3 scripts/inspect.py --result out/fail_result_5m.json --query "failover_to_frontier==2 && degraded_queue==18 && token_health_min>=0.5"
)

(
  cd goodhart-validator
  python3 scripts/run_validation.py --validation specs/validation.yaml --metrics fixtures/new_metrics_good.json
  python3 scripts/compare_drift.py --baseline fixtures/baseline_metrics.json --new fixtures/new_metrics_good.json
  python3 scripts/ci_gate.py --validation specs/validation.yaml --baseline fixtures/baseline_metrics.json --new fixtures/new_metrics_good.json
  expect_fail python3 scripts/run_validation.py --validation specs/validation.yaml --metrics fixtures/new_metrics_bad.json
  expect_fail python3 scripts/compare_drift.py --baseline fixtures/baseline_metrics.json --new fixtures/new_metrics_drift.json
  expect_fail python3 scripts/ci_gate.py --validation specs/validation.yaml --baseline fixtures/baseline_metrics.json --new fixtures/new_metrics_bad.json
)

(
  cd real-api
  python3 scripts/normalize_webhook.py --grafana fixtures/webhook_grafana.json --pagerduty fixtures/webhook_pagerduty.json --expected fixtures/incident_event.expected.json
  python3 scripts/check_readiness.py --readiness fixtures/readiness_pass.json
  python3 scripts/dry_run.py --spec specs/high_memory_usage/specify.md --action restart_pod
  expect_fail python3 scripts/check_readiness.py --readiness fixtures/readiness_block_audit.json
  expect_fail python3 scripts/check_readiness.py --readiness fixtures/readiness_block_stateful.json
  expect_fail python3 scripts/dry_run.py --spec specs/high_memory_usage/specify.md --action delete_namespace
)

echo "smoke_all: PASS"
