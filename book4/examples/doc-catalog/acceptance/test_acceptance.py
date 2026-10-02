import tempfile
import unittest
from pathlib import Path

import catalog


class AcceptanceTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        directory = Path(self.tempdir.name)
        (directory / "alpha.md").write_text("# Alpha Guide\nneedle only in body\n", encoding="utf-8")
        (directory / "beta.md").write_text("# Бета Notes\nтекст документа\n", encoding="utf-8")
        (directory / "gamma.md").write_text("без заголовка\n", encoding="utf-8")
        (directory / "body.md").write_text("# Public Guide\nneedle\n", encoding="utf-8")
        (directory / "ignored.txt").write_text("# Ignored\n", encoding="utf-8")
        self.directory = directory

    def tearDown(self):
        self.tempdir.cleanup()

    def test_uppercase_cyrillic_query(self):
        self.assertEqual(catalog.search_documents(self.directory, "БЕТА"), ["Бета Notes"])

    def test_body_only_match_is_excluded(self):
        self.assertEqual(catalog.search_documents(self.directory, "needle"), [])

    def test_empty_whitespace_query_returns_all(self):
        self.assertEqual(
            catalog.search_documents(self.directory, "  "),
            ["Alpha Guide", "gamma.md", "Public Guide", "Бета Notes"],
        )

    def test_non_markdown_file_is_excluded(self):
        self.assertEqual(catalog.search_documents(self.directory, "Ignored"), [])

    def test_filename_fallback(self):
        self.assertEqual(catalog.search_documents(self.directory, "gamma"), ["gamma.md"])

    def test_identity_and_casefold_ordering(self):
        self.assertEqual(
            catalog.search_documents(self.directory, "Guide"),
            ["Alpha Guide", "Public Guide"],
        )


if __name__ == "__main__":
    unittest.main()
