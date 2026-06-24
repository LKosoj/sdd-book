with expected as (
  select
    customer_id,
    count(*) as transaction_count_7d,
    sum(case when risk_flag then 1 else 0 end) as risk_event_count_7d
  from {{ ref('stg_card_transactions') }}
  where transaction_date between date '2026-06-01' and date '2026-06-07'
  group by 1
),
actual as (
  select
    customer_id,
    transaction_count_7d,
    risk_event_count_7d
  from {{ ref('int_customer_card_activity') }}
)
select
  coalesce(expected.customer_id, actual.customer_id) as customer_id,
  expected.transaction_count_7d as expected_transaction_count_7d,
  actual.transaction_count_7d as actual_transaction_count_7d,
  expected.risk_event_count_7d as expected_risk_event_count_7d,
  actual.risk_event_count_7d as actual_risk_event_count_7d
from expected
full outer join actual using (customer_id)
where coalesce(expected.transaction_count_7d, -1) != coalesce(actual.transaction_count_7d, -1)
   or coalesce(expected.risk_event_count_7d, -1) != coalesce(actual.risk_event_count_7d, -1)

