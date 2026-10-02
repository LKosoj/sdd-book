import unittest

import catalog


class SmokeTests(unittest.TestCase):
    def test_empty_query_returns_documents(self):
        self.assertEqual(catalog.search_documents("data", ""), ["Альфа", "Бета", "Гамма"])

    def test_matching_case_returns_title(self):
        self.assertEqual(catalog.search_documents("data", "Альфа"), ["Альфа"])


if __name__ == "__main__":
    unittest.main()
