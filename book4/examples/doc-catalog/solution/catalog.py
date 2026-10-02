"""Minimal document title catalog."""

import argparse
from pathlib import Path


def search_documents(directory, query):
    """Return matching Markdown document titles from a directory."""
    directory = Path(directory)
    query = query.strip().casefold()
    results = []

    for path in directory.iterdir():
        if not path.is_file() or path.suffix != ".md":
            continue
        first_line = path.read_text(encoding="utf-8").splitlines()[:1]
        title = first_line[0][2:].strip() if first_line and first_line[0].startswith("# ") else path.name
        if not query or query in title.casefold():
            results.append(title)

    return sorted(results, key=str.casefold)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("directory")
    parser.add_argument("query")
    args = parser.parse_args()
    for title in search_documents(args.directory, args.query):
        print(title)


if __name__ == "__main__":
    main()
