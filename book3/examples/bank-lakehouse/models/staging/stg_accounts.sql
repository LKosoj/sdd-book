select
  account_id,
  customer_id,
  product_code,
  cast(opened_at as date) as opened_at,
  cast(balance_rub as decimal(18, 2)) as balance_rub,
  status
from read_csv_auto('raw/accounts.csv', header = true)

