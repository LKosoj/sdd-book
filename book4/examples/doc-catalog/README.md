# Каталог заголовков документов

Учебный проект показывает маленький каталог Markdown-документов. `catalog.py` читает только `.md`-файлы непосредственно из указанного каталога, берёт заголовок из первой строки и ищет подстроку в заголовке.

В `starter` оставлен намеренный дефект: поиск чувствителен к регистру. Поэтому smoke-тесты проходят, а acceptance-тест с запросом `БЕТА` ожидаемо падает.

Запуск из корня этого примера (`book4/examples/doc-catalog`):

```bash
PYTHONPATH=starter python3 -m unittest discover -s tests -v
PYTHONPATH=starter python3 -m unittest discover -s acceptance -v
PYTHONPATH=solution python3 -m unittest discover -s tests -v
PYTHONPATH=solution python3 -m unittest discover -s acceptance -v
```

Ожидаемый результат: smoke проходит для обоих вариантов; acceptance в `starter` имеет ровно один намеренный failed тест (`test_uppercase_cyrillic_query`); acceptance в `solution` проходит полностью.

CLI печатает найденные заголовки по одному в строке. Из корня примера:

```bash
python3 starter/catalog.py data АЛЬ
python3 solution/catalog.py data АЛЬ
```

Ожидаемый вывод: первая команда ничего не печатает (намеренный дефект регистра),
вторая печатает `Альфа`.

Та же форма запуска используется в [части 15](../../part-15-laboratories.md),
но внутри учебной копии (`catalog.py` в корне копии) — там команда короче:
`python3 catalog.py data АЛЬ`.
