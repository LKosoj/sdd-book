select
  stage,
  count(*) as loan_count,
  sum(principal_rub) as principal_rub,
  avg(days_past_due) as avg_days_past_due,
  sum(case when days_past_due > 30 then principal_rub else 0 end) as overdue_30p_principal_rub
from {{ ref('stg_loans') }}
group by 1

