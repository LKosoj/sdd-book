-- depends_on: {{ ref('mart_customer_360') }}

select column_name
from information_schema.columns
where table_schema = 'main'
  and table_name = 'mart_customer_360'
  and (
    lower(column_name) like 'pii_%'
    or lower(column_name) in ('email', 'phone', 'passport', 'passport_number')
  )

