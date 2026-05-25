# Аукцион теневых спецификаций

Минимальный runnable-пример к части 6 «Аукцион теневых спецификаций». Показывает,
как превратить неформальные наблюдения дежурных в проверяемый слой
кандидатов, оценить их на исторических инцидентах и выбрать победителей
по бюджету токенов. Скрипты на Python, запуск через `python3`, без других
внешних зависимостей.

## Что такое теневая спецификация

Теневая спецификация — это формализованный нюанс из практики on-call, у которого
есть `контекст -> признак -> наблюдаемый эффект`, источник и срок
пересмотра. В отличие от требования, он не описывает обязательное
поведение системы, а только эвристику, повышающую качество triage. Чтобы
не разрастаться, такие записи проходят аукцион: каждый кандидат
получает score на исторических инцидентах и конкурирует за ограниченный
бюджет токенов в `QWEN.md`.

## Структура

- `candidates/candidates.yaml` — четыре кандидата с разной судьбой:
  один очевидный winner, один loser, один редкий high-value сигнал и
  один средний.
- `data/incidents.jsonl` — 20 учебных инцидентов с baseline MTTR,
  фактическим MTTR, списком наблюдённых features и флагом ложной
  эскалации.
- `scripts/score.py` — считает score по формуле
  `w_mttr*mttr_gain + w_early*early_signal + w_cov*coverage - w_fp*false_escalation`
  и пишет `out/scorebook.json`.
- `scripts/decide.py` — применяет пороги и token budget, делит
  кандидатов на winners, disputed и rejected.
- `scripts/write_qwen_block.py` — генерирует версионированный few-shot
  блок для `QWEN.md` из winners.
- `outputs/*.example.*` — образцы того, что должно получиться.

## Запуск

Из каталога `book2/examples/shadow-auction`:

```bash
python3 scripts/score.py \
  --candidates candidates/candidates.yaml \
  --incidents data/incidents.jsonl \
  --weights 0.5,0.3,0.2,0.4 \
  --out out/scorebook.json

python3 scripts/decide.py \
  --scorebook out/scorebook.json \
  --budget-tokens 2000 \
  --keep-threshold 0.70 \
  --reject-threshold 0.40 \
  --out-auction out/auction.json \
  --out-quarantine out/quarantine.json

python3 scripts/write_qwen_block.py \
  --auction out/auction.json \
  --target-anchor "QWEN.md#incident-triage-shadow" \
  --today 2026-05-17 \
  --out out/qwen_block.md
```

После прогона с весами по умолчанию ожидается один winner
(`shadow.p0.voice_handoff`), один rejected (`shadow.alert.red_color_urgency`,
причина `high_false_escalation`) и два disputed (`shadow.repeated_5xx_burst`
и `shadow.dc.burn_smell_power_risk`).

Параметр `--today 2026-05-17` нужен только для учебного сравнения с файлами
из `outputs/`. В реальном проектном прогоне его можно опустить, тогда дата
будет взята из текущего дня.

## Как меняется решение при разных весах

- Уменьшение `w_fp` (например `0.5,0.3,0.2,0.1`) позволяет шумным
  кандидатам подняться выше порога отсечения. Это удобно, чтобы
  показать, как Goodhart-ловушка получает себе место в `QWEN.md`,
  когда штраф за ложные эскалации занижен.
- Рост `w_early` (например `0.4,0.5,0.1,0.4`) выводит
  `shadow.dc.burn_smell_power_risk` ближе к keep-threshold, потому что
  у него высокий early_signal при низком coverage.
- Понижение `--keep-threshold` до `0.55` переводит средние кандидаты
  из disputed в winners; тогда видно, как token budget начинает
  реально ограничивать выбор, а не только пороги score.

## Как читать scorebook.json

Поле `weights` фиксирует формулу прогона, `incident_count` — размер
выборки, `candidates[].metrics` — четыре компонента score,
`candidates[].matched_incidents` — id инцидентов, на которых feature
действительно сработал. Этот журнал должен храниться рядом со
spec-памятью (например в `.specify/memory/shadow-scorebook.json`),
чтобы решение аукциона можно было воспроизвести при пересмотре весов.
