#!/usr/bin/env python3
"""Генерирует синтетические банковские данные для примеров учебника SDD Data."""

from __future__ import annotations

import csv
from datetime import date, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "raw"
SEEDS = ROOT / "seeds"


def write_csv(path: Path, rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
      writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
      writer.writeheader()
      writer.writerows(rows)


def main() -> None:
    customers = [
        {"customer_id": "C001", "birth_date": "1988-03-14", "region": "MOW", "segment": "mass", "pii_email": "c001@example.invalid", "is_resident": True},
        {"customer_id": "C002", "birth_date": "1976-11-02", "region": "SPE", "segment": "affluent", "pii_email": "c002@example.invalid", "is_resident": True},
        {"customer_id": "C003", "birth_date": "1995-07-20", "region": "NVS", "segment": "mass", "pii_email": "c003@example.invalid", "is_resident": True},
        {"customer_id": "C004", "birth_date": "1969-01-08", "region": "KZN", "segment": "sme_owner", "pii_email": "c004@example.invalid", "is_resident": True},
    ]
    accounts = [
        {"account_id": "A001", "customer_id": "C001", "product_code": "CURR", "opened_at": "2025-01-10", "balance_rub": 125000.50, "status": "active"},
        {"account_id": "A002", "customer_id": "C002", "product_code": "SAVE", "opened_at": "2024-08-22", "balance_rub": 920000.00, "status": "active"},
        {"account_id": "A003", "customer_id": "C003", "product_code": "CURR", "opened_at": "2026-02-05", "balance_rub": 18200.00, "status": "active"},
        {"account_id": "A004", "customer_id": "C004", "product_code": "SME", "opened_at": "2023-05-19", "balance_rub": 1840000.00, "status": "blocked"},
    ]
    tx_rows = []
    start = date(2026, 6, 1)
    mcc_codes = ["5411", "5812", "6011", "7995", "4111"]
    for i in range(20):
        customer = customers[i % len(customers)]
        amount = [950.0, 2400.0, 7200.0, 151000.0, 420.0][i % 5]
        mcc = mcc_codes[i % len(mcc_codes)]
        tx_rows.append({
            "transaction_id": f"T{i + 1:04d}",
            "customer_id": customer["customer_id"],
            "transaction_date": (start + timedelta(days=i % 7)).isoformat(),
            "mcc": mcc,
            "amount_rub": amount,
            "channel": ["card", "sbp", "atm", "card", "online"][i % 5],
            "risk_flag": amount > 100000 or mcc == "7995",
        })
    loans = [
        {"loan_id": "L001", "customer_id": "C001", "principal_rub": 650000.0, "opened_at": "2025-04-12", "days_past_due": 0, "stage": 1},
        {"loan_id": "L002", "customer_id": "C002", "principal_rub": 2100000.0, "opened_at": "2024-09-01", "days_past_due": 3, "stage": 1},
        {"loan_id": "L003", "customer_id": "C003", "principal_rub": 320000.0, "opened_at": "2026-02-20", "days_past_due": 38, "stage": 2},
    ]
    consents = [
        {"consent_id": "CN001", "customer_id": "C001", "scope": "accounts.read", "granted_at": "2026-05-01", "revoked_at": ""},
        {"consent_id": "CN002", "customer_id": "C002", "scope": "payments.read", "granted_at": "2026-05-04", "revoked_at": ""},
        {"consent_id": "CN003", "customer_id": "C003", "scope": "accounts.read", "granted_at": "2026-05-07", "revoked_at": "2026-06-01"},
    ]
    rates = [
        {"rate_date": "2026-06-01", "currency": "USD", "rate_rub": 87.10},
        {"rate_date": "2026-06-01", "currency": "EUR", "rate_rub": 94.20},
        {"rate_date": "2026-06-02", "currency": "USD", "rate_rub": 87.35},
        {"rate_date": "2026-06-02", "currency": "EUR", "rate_rub": 94.05},
    ]
    products = [
        {"product_code": "CURR", "product_name": "Текущий счёт", "product_family": "account"},
        {"product_code": "SAVE", "product_name": "Накопительный счёт", "product_family": "account"},
        {"product_code": "SME", "product_name": "Расчётный счёт МСБ", "product_family": "business"},
    ]

    write_csv(RAW / "customers.csv", customers)
    write_csv(RAW / "accounts.csv", accounts)
    write_csv(RAW / "card_transactions.csv", tx_rows)
    write_csv(RAW / "loans.csv", loans)
    write_csv(RAW / "open_api_consents.csv", consents)
    write_csv(RAW / "cbr_rates.csv", rates)
    write_csv(SEEDS / "ref_products.csv", products)
    print(f"Синтетические данные созданы в {RAW} и {SEEDS}")


if __name__ == "__main__":
    main()
