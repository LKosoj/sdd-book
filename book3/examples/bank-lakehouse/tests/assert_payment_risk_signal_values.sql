select *
from {{ ref('mart_payment_risk_signals') }}
where risk_signal not in ('large_amount', 'source_risk_flag')

