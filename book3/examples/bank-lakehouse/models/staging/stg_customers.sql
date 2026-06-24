select
  customer_id,
  cast(birth_date as date) as birth_date,
  region,
  segment,
  pii_email,
  cast(is_resident as boolean) as is_resident
from read_csv_auto('raw/customers.csv', header = true)

