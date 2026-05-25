# Требования — incident payload

## Границы

REQ-001: WHEN monitoring webhook creates an incident event, THE SYSTEM SHALL include a stable `incident_id`.

REQ-002: WHEN incident severity is recorded, THE SYSTEM SHALL use one of `P0`, `P1`, `P2`, `P3`.

REQ-003: WHEN the event is accepted, THE SYSTEM SHALL include `service`, `source` and `received_at`.

## За границами

- Без вызова реального PagerDuty, Grafana или Kubernetes API.
- Без auto-remediation.
- Без хранения секретов в fixtures.

