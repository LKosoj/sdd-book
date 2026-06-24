select
  transaction_id,
  customer_id,
  transaction_date,
  mcc,
  amount_rub,
  channel,
  case
    when amount_rub >= 100000 then 'large_amount'
    when risk_flag then 'source_risk_flag'
    else 'normal'
  end as risk_signal
from {{ ref('stg_card_transactions') }}
where risk_flag or amount_rub >= 100000

