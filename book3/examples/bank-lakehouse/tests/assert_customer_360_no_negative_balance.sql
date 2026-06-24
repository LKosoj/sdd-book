select *
from {{ ref('mart_customer_360') }}
where total_balance_rub < 0

