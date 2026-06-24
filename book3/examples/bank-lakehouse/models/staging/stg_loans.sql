select
  loan_id,
  customer_id,
  cast(principal_rub as decimal(18, 2)) as principal_rub,
  cast(opened_at as date) as opened_at,
  cast(days_past_due as integer) as days_past_due,
  cast(stage as integer) as stage
from read_csv_auto('raw/loans.csv', header = true)

