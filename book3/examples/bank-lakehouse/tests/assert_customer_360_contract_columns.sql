-- depends_on: {{ ref('mart_customer_360') }}

with required_columns(column_name) as (
  values
    ('customer_id'),
    ('total_balance_rub'),
    ('risk_event_count_7d')
),
actual_columns as (
  select column_name
  from information_schema.columns
  where table_schema = 'main'
    and table_name = 'mart_customer_360'
)
select required_columns.column_name
from required_columns
left join actual_columns using (column_name)
where actual_columns.column_name is null

