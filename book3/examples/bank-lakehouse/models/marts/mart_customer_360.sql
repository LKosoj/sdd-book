select
  c.customer_id,
  c.region,
  c.segment,
  c.is_resident,
  coalesce(b.account_count, 0) as account_count,
  coalesce(b.active_account_count, 0) as active_account_count,
  coalesce(b.total_balance_rub, 0) as total_balance_rub,
  coalesce(t.transaction_count_7d, 0) as transaction_count_7d,
  coalesce(t.turnover_rub_7d, 0) as turnover_rub_7d,
  coalesce(t.risk_event_count_7d, 0) as risk_event_count_7d,
  t.last_transaction_date
from {{ ref('stg_customers') }} c
left join {{ ref('int_customer_balances') }} b using (customer_id)
left join {{ ref('int_customer_card_activity') }} t using (customer_id)

