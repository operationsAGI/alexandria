#!/usr/bin/env python3
"""
Merge updated Amazon links from a supplementary CSV into books.csv.

Link column only, matched on title. Everything else in books.csv — author,
recommender, row order — is left alone, because the supplementary sheets are
partial extracts and their other columns can carry annotations that would
corrupt the master (e.g. a "Recommended by" cell reading
"Jeremy Nixon + Clovis (2 tiles, 1 file)" where the master has two rows).

Usage:
    python3 merge_links.py "../../Books with no covers - Sheet1.csv"

Writes books.csv in place, after saving books.csv.bak, and prints a diff.
Re-run build.py afterwards.
"""

import csv
import pathlib
import shutil
import sys

HERE = pathlib.Path(__file__).parent
MASTER = HERE / "books.csv"

TITLE_KEYS = ("Book Name", "Title")
LINK_KEYS = ("Amazon Purchase Link", "Link", "URL")


def norm(s):
    return (s or "").strip().casefold()


def pick(row, keys):
    """First matching column by name, else the last column (often unnamed)."""
    for k in keys:
        if k in row and row[k] is not None:
            return row[k]
    return None


def read_updates(path):
    """Supplementary CSV -> {normalised title: new link}."""
    updates = {}
    with open(path, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        # Google Sheets exports a trailing comma, giving the link column an
        # empty-string header. Fall back to it when no named column matches.
        link_fallback = next(
            (f for f in reader.fieldnames if not (f or "").strip()), None
        )
        for row in reader:
            title = pick(row, TITLE_KEYS)
            link = pick(row, LINK_KEYS)
            if link is None and link_fallback is not None:
                link = row.get(link_fallback)
            if not norm(title):
                continue
            updates[norm(title)] = (link or "").strip()
    return updates


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)

    updates = read_updates(sys.argv[1])

    with open(MASTER, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        fields = reader.fieldnames
        rows = list(reader)

    changed, cleared, matched = [], [], set()

    for row in rows:
        key = norm(row.get("Book Name"))
        if key not in updates:
            continue
        matched.add(key)

        old = (row.get("Amazon Purchase Link") or "").strip()
        new = updates[key]

        if not new:
            # Blank in the update sheet means "there is no link" — only act if
            # the master holds a non-URL (the sheet has stray notes in this
            # column). Never blank a real URL on the strength of an omission.
            if old and not old.startswith("http"):
                row["Amazon Purchase Link"] = ""
                cleared.append((row["Book Name"], old))
            continue

        if new != old:
            row["Amazon Purchase Link"] = new
            changed.append((row["Book Name"], old, new))

    unmatched = sorted(set(updates) - matched)

    with open(MASTER, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    print(f"{len(matched)}/{len(updates)} titles matched in books.csv")

    if changed:
        print(f"\nlinks updated ({len(changed)}):")
        for title, old, new in changed:
            print(f"  {title}")
            print(f"    - {old or '(empty)'}")
            print(f"    + {new}")

    if cleared:
        print(f"\nnon-URL values cleared ({len(cleared)}):")
        for title, old in cleared:
            print(f"  {title}: {old!r} -> (empty)")

    if unmatched:
        print(f"\nWARNING: no row in books.csv for ({len(unmatched)}):")
        for key in unmatched:
            print(f"  {key}")

    if not (changed or cleared):
        print("\nno changes — every link already matched the master")


if __name__ == "__main__":
    shutil.copy(MASTER, MASTER.with_suffix(".csv.bak"))
    main()
    print(f"\nbackup: {MASTER.with_suffix('.csv.bak').name}   now re-run build.py")
