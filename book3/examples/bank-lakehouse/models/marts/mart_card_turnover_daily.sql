select
  transaction_date,
  channel,
  count(*) as transaction_count,
  sum(amount_rub) as turnover_rub,
  sum(case when risk_flag then 1 else 0 end) as risk_event_count
from {{ ref('stg_card_transactions') }}
group by 1, 2

