with activity_window as (
  select
    date '2026-06-01' as window_start,
    date '2026-06-07' as window_end
),
filtered_transactions as (
  select t.*
  from {{ ref('stg_card_transactions') }} t
  cross join activity_window w
  where t.transaction_date between w.window_start and w.window_end
)
select
  customer_id,
  count(*) as transaction_count_7d,
  sum(amount_rub) as turnover_rub_7d,
  sum(case when risk_flag then 1 else 0 end) as risk_event_count_7d,
  max(transaction_date) as last_transaction_date
from filtered_transactions
group by 1
