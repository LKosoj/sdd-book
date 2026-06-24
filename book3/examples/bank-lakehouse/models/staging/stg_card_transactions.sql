select
  transaction_id,
  customer_id,
  cast(transaction_date as date) as transaction_date,
  mcc,
  cast(amount_rub as decimal(18, 2)) as amount_rub,
  channel,
  cast(risk_flag as boolean) as risk_flag
from read_csv_auto('raw/card_transactions.csv', header = true)

