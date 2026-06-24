select *
from {{ ref('mart_card_turnover_daily') }}
where transaction_count < 0
   or turnover_rub < 0
   or risk_event_count < 0

