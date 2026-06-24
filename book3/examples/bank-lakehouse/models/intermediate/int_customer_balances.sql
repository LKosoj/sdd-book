select
  a.customer_id,
  count(*) as account_count,
  sum(case when a.status = 'active' then 1 else 0 end) as active_account_count,
  sum(a.balance_rub) as total_balance_rub
from {{ ref('stg_accounts') }} a
group by 1

