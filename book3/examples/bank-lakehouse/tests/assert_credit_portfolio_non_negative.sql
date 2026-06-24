select *
from {{ ref('mart_credit_portfolio_quality') }}
where loan_count < 0
   or principal_rub < 0
   or overdue_30p_principal_rub < 0

