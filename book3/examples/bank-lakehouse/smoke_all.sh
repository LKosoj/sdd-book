#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

python3 scripts/generate_data.py

test -f raw/customers.csv
test -f raw/card_transactions.csv
test -f specs/customer_360_contract.odcs.yaml
test -f models/marts/mart_customer_360.sql

if command -v dbt >/dev/null 2>&1; then
  dbt parse --profiles-dir .
  dbt build --profiles-dir .
else
  echo "dbt не установлен; проверка структуры и генерации данных пройдена."
fi
