#!/usr/bin/env python3
"""
Build an Alexandria event page from the "Fantasy to Reality" bundle.

The source site was shipped as a single pre-built Vite bundle (one minified
line of React). There is no JSX source on this machine, so this script treats
that bundle as a template and swaps out the data literals inside it:

    Ze = {...}    event metadata
    Ju = [...]    the book list
    Wu = [...]    the "Events" dropdown in the nav
    <h1>          the two-line hero title
    gallery imgs  the three inlined base64 photos
    video card    the YouTube thumbnail card
    <head>        title / description / og: / twitter: tags

Inputs (all in this directory):
    event.json    event metadata + placeholder copy
    books.csv     Book Name, Author, Recommender, Amazon Purchase Link
    photos/       0 or 3 images -> inlined as base64; empty = placeholder tiles
    covers/       manual book covers, named <book-title-slug>.<ext>; these
                  override the OpenLibrary lookup entirely

Output:
    index.html    fully self-contained, ~5.6 MB

Usage:
    python3 build.py
"""

import base64
import csv
import difflib
import json
import mimetypes
import pathlib
import re
import struct
import sys

HERE = pathlib.Path(__file__).parent
TEMPLATE = HERE.parent / "Fantasy to Reality" / "index.html"
BUNDLE_LINE = 70  # 0-indexed; the single minified app line

PHOTO_SLOTS = 3


# ---------------------------------------------------------------- helpers


def js(value):
    """Python value -> JS literal. json.dumps output is valid JS."""
    return json.dumps(value, ensure_ascii=False)


def match_delimiter(text, start):
    """Return the index of the delimiter closing the [ or { at `start`.

    String-aware, so brackets inside literals don't throw off the count.
    """
    depth = 0
    i = start
    while i < len(text):
        c = text[i]
        if c in "\"'`":
            quote = c
            i += 1
            while text[i] != quote:
                if text[i] == "\\":
                    i += 1
                i += 1
        elif c in "[{":
            depth += 1
        elif c in "]}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise ValueError("unbalanced delimiter")


def replace_literal(line, anchor, new_literal):
    """Replace the array/object literal that starts at `anchor`.

    `anchor` includes everything up to and including the opening bracket,
    e.g. 'Ze={' or ',Ju=['.
    """
    start = line.find(anchor)
    if start < 0:
        raise ValueError(f"anchor not found: {anchor!r}")
    open_at = start + len(anchor) - 1
    close_at = match_delimiter(line, open_at)
    return line[:open_at] + new_literal + line[close_at + 1 :]


def replace_once(text, old, new, what):
    """str.replace, but loudly refuse to silently no-op."""
    if old not in text:
        raise ValueError(f"could not find {what} in the template")
    return text.replace(old, new, 1)


# ---------------------------------------------------------------- books


AMAZON_DP = re.compile(r"/dp/([A-Z0-9]{10})", re.I)
ISBN10 = re.compile(r"^\d{9}[\dXx]$")

COVER_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def slugify(title):
    """Book title -> the filename stem expected in covers/."""
    s = title.lower().replace("&", " and ")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def load_covers(cover_dir):
    """covers/ -> {slug: data URI}."""
    found = {}
    if not cover_dir.is_dir():
        return found
    for path in sorted(cover_dir.iterdir()):
        if path.suffix.lower() not in COVER_EXTS:
            continue
        mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
        data = base64.b64encode(path.read_bytes()).decode("ascii")
        found[slugify(path.stem)] = f"data:{mime};base64,{data}"
    return found


def resolve_covers(covers, titles):
    """Map each covers/ file onto a book title.

    Cover files get named after the edition on the jacket, not after the CSV
    row — "dominion-the-nature-of-diabolic-warfare.jpg" for a book the sheet
    calls "Dominion". So: exact slug match first, then subtitle containment,
    then close-spelling. The last two only accept an unambiguous winner, and
    every inexact match is printed so it can be checked.
    """
    by_slug = {slugify(t): t for t in titles}
    resolved, fuzzy = {}, []

    # Exact matches first, and they are final. Otherwise a longer filename
    # like "transhumanism-and-its-critics" can be swallowed by the shorter
    # book "Transhumanism" before that book's own exact file is even seen.
    pending = {}
    for cover_slug, uri in covers.items():
        if cover_slug in by_slug:
            resolved[by_slug[cover_slug]] = uri
        else:
            pending[cover_slug] = uri

    free = {s: t for s, t in by_slug.items() if t not in resolved}

    for cover_slug, uri in pending.items():
        # A jacket subtitle the CSV omits, or vice versa.
        contained = [
            t
            for s, t in free.items()
            if cover_slug.startswith(s + "-") or s.startswith(cover_slug + "-")
        ]
        if len(contained) == 1:
            resolved[contained[0]] = uri
            free = {s: t for s, t in free.items() if t != contained[0]}
            fuzzy.append((cover_slug, contained[0], "subtitle"))
            continue

        # A spelling slip ("technosis" for "techgnosis"). Require a clear
        # winner so a near-tie never silently picks the wrong book.
        scored = sorted(
            ((difflib.SequenceMatcher(None, cover_slug, s).ratio(), t)
             for s, t in free.items()),
            reverse=True,
        )
        best = scored[0] if scored else (0, None)
        runner_up = scored[1] if len(scored) > 1 else (0, None)
        if best[1] and best[0] >= 0.80 and best[0] - runner_up[0] >= 0.05:
            resolved[best[1]] = uri
            free = {s: t for s, t in free.items() if t != best[1]}
            fuzzy.append((cover_slug, best[1], f"{best[0]:.0%} match"))
        else:
            fuzzy.append((cover_slug, None, "no match"))

    return resolved, fuzzy


def read_books(path):
    """books.csv -> list of dicts matching the bundle's book shape."""
    books = []
    with open(path, newline="", encoding="utf-8-sig") as fh:
        for row in csv.DictReader(fh):
            title = (row.get("Book Name") or "").strip()
            if not title:
                continue

            author = (row.get("Author") or "").strip() or None
            recommender = (row.get("Recommender") or "").strip() or "Unknown"
            raw_link = (row.get("Amazon Purchase Link") or "").strip()

            # Normalise sprawling Amazon URLs down to /dp/<ASIN>, and drop
            # anything that isn't actually a URL (the sheet has stray notes
            # like "No author info" in this column).
            link, isbn = None, None
            if raw_link.startswith("http"):
                m = AMAZON_DP.search(raw_link)
                if m:
                    asin = m.group(1).upper()
                    link = f"https://www.amazon.com/dp/{asin}"
                    # OpenLibrary covers only resolve for real ISBN-10s,
                    # not Amazon's B0... ASINs.
                    if ISBN10.match(asin):
                        isbn = asin
                else:
                    link = raw_link

            books.append(
                {
                    "title": title,
                    "author": author,
                    "recommender": recommender,
                    "link": link,
                    "isbn": isbn,
                }
            )
    return books


def books_literal(books):
    parts = []
    for b in books:
        fields = ",".join(f"{k}:{js(v)}" for k, v in b.items())
        parts.append("{" + fields + "}")
    return "[" + ",".join(parts) + "]"


# ---------------------------------------------------------------- media


PHOTO_PLACEHOLDER = (
    'p.jsx("div",{className:"flex aspect-[4/3] w-full items-center justify-center '
    'rounded-sm border border-dashed border-amber-500/30 bg-ink-950/40 shadow-page",'
    'children:p.jsx("span",{className:"font-sans text-xs uppercase '
    'tracking-[0.25em] text-parchment-500",children:"Photo coming soon"})})'
)

VIDEO_PLACEHOLDER = (
    'p.jsx("div",{className:"mb-8 flex aspect-video w-full items-center '
    'justify-center rounded-sm border border-dashed border-amber-500/30 '
    'bg-ink-950/40 shadow-page",children:p.jsx("span",{className:"font-sans '
    'text-xs uppercase tracking-[0.25em] text-parchment-500",'
    'children:"Video coming soon"})})'
)

GALLERY_IMG = re.compile(
    r'p\.jsx\("img",\{src:"data:image/jpeg;base64,[^"]*",alt:"[^"]*",'
    r'className:"aspect-\[4/3\][^"]*"\}\)'
)


def image_size(path):
    """(width, height) for a PNG or JPEG, without pulling in Pillow."""
    data = path.read_bytes()

    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", data[16:24])

    if data[:2] == b"\xff\xd8":
        i = 2
        while i < len(data) - 9:
            if data[i] != 0xFF:
                i += 1
                continue
            marker = data[i + 1]
            # SOF0-SOF15, minus the non-frame markers in that range
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6,
                          0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                h, w = struct.unpack(">HH", data[i + 5 : i + 9])
                return w, h
            if marker in (0xD8, 0xD9) or 0xD0 <= marker <= 0xD7:
                i += 2
                continue
            i += 2 + struct.unpack(">H", data[i + 2 : i + 4])[0]

    raise ValueError(f"can't read dimensions of {path.name} — PNG or JPEG only")


def find_og_image(og_dir):
    """The social-card image. Returns (path, width, height) or None.

    Deliberately its own folder rather than photos/: og:image has to be a
    real hosted URL (every scraper rejects data: URIs), so this one is never
    inlined — it just supplies the dimensions the meta tags declare.
    """
    if not og_dir.is_dir():
        return None
    files = sorted(
        p for p in og_dir.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg"}
    )
    if not files:
        return None
    path = files[0]
    w, h = image_size(path)
    return path, w, h


def photo_elements(photo_dir):
    """Inline photos/ as base64, or fall back to placeholder tiles."""
    files = sorted(
        p
        for p in photo_dir.glob("*")
        if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    )
    elements = []
    for i in range(PHOTO_SLOTS):
        if i < len(files):
            path = files[i]
            mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
            data = base64.b64encode(path.read_bytes()).decode("ascii")
            alt = f"Photo from the reading night: {path.stem}"
            elements.append(
                'p.jsx("img",{src:"data:%s;base64,%s",alt:%s,'
                'className:"aspect-[4/3] w-full rounded-sm border '
                'border-amber-500/20 object-cover shadow-page"})'
                % (mime, data, js(alt))
            )
        else:
            elements.append(PHOTO_PLACEHOLDER)
    return elements, len(files)


# ---------------------------------------------------------------- build


def main():
    if not TEMPLATE.exists():
        sys.exit(f"template not found: {TEMPLATE}")

    event = json.loads((HERE / "event.json").read_text(encoding="utf-8"))
    books = read_books(HERE / "books.csv")
    readers = {b["recommender"] for b in books}

    # A file in covers/ wins over the OpenLibrary lookup. The bundle already
    # understands coverOverride, so this needs no JSX change.
    covers = load_covers(HERE / "covers")
    resolved, fuzzy = resolve_covers(covers, [b["title"] for b in books])
    for b in books:
        if b["title"] in resolved:
            b["coverOverride"] = resolved[b["title"]]

    used = {b["title"] for b in books if "coverOverride" in b}

    lines = TEMPLATE.read_text(encoding="utf-8").split("\n")
    line = lines[BUNDLE_LINE]

    # -- event metadata -------------------------------------------------
    meta = {
        "title": event["title"],
        "subtitle": event["subtitle"],
        "date": event["date"],
        "location": event["location"],
        "lumaUrl": event["lumaUrl"],
        "youtubeId": event["youtubeId"],
        "intro": event["intro"],
        "body": event["body"],
    }
    meta_literal = "{" + ",".join(f"{k}:{js(v)}" for k, v in meta.items()) + "}"
    line = replace_literal(line, "Ze={", meta_literal)

    # -- books ----------------------------------------------------------
    anchor_at = line.find("recommender")
    array_at = line.rfind("=[", 0, anchor_at) + 1
    close_at = match_delimiter(line, array_at)
    line = line[:array_at] + books_literal(books) + line[close_at + 1 :]

    # -- nav dropdown: this event only ----------------------------------
    href = f"/events/{event['slug']}/"
    line = replace_literal(
        line,
        "Wu=[",
        "[{title:%s,href:%s}]" % (js(event["title"]), js(href)),
    )

    # -- hero title (hard-coded as two lines in the original) ------------
    line1, line2 = event["titleLines"]
    line = replace_once(
        line,
        'children:["The Crossing:",p.jsx("br",{}),"From Fantasy to Reality"]',
        'children:[%s,p.jsx("br",{}),%s]' % (js(line1), js(line2)),
        "hero <h1>",
    )

    # -- gallery photos --------------------------------------------------
    elements, n_photos = photo_elements(HERE / "photos")
    found = GALLERY_IMG.findall(line)
    if len(found) != PHOTO_SLOTS:
        raise ValueError(f"expected {PHOTO_SLOTS} gallery images, found {len(found)}")
    for old, new in zip(found, elements):
        line = line.replace(old, new, 1)

    # -- cover fallback --------------------------------------------------
    # OpenLibrary answers "no cover" with a 1x1 transparent pixel rather than
    # a 404, so the bundle's onError handler never fires and you get a blank
    # tile instead of the gradient fallback. ?default=false makes it 404.
    line = replace_once(
        line,
        "https://covers.openlibrary.org/b/isbn/${e.isbn}-M.jpg",
        "https://covers.openlibrary.org/b/isbn/${e.isbn}-M.jpg?default=false",
        "OpenLibrary cover URL",
    )

    # -- video card: real embed if we have an id, placeholder if not ------
    video_call = (
        "p.jsx(Hf,{youtubeId:Ze.youtubeId,"
        "title:`${Ze.title}: video from the night`})"
    )
    line = replace_once(
        line,
        video_call,
        f"Ze.youtubeId?{video_call}:{VIDEO_PLACEHOLDER}",
        "video card",
    )

    lines[BUNDLE_LINE] = line
    html = "\n".join(lines)

    # -- <head> ----------------------------------------------------------
    old_title = "The Crossing: From Fantasy to Reality - Alexandria"
    new_title = f"{event['title']} - Alexandria"
    html = html.replace(old_title, new_title)

    head_swaps = [
        (
            "The best science fiction isn't about the future, it's about the ideas "
            "we're not brave enough to think out loud yet. Recap of Alexandria's "
            "Science Fiction Reading Night in San Francisco.",
            event["metaDescription"],
        ),
        (
            "A Science Fiction Reading Night: 135 books, 11 readers, one table, one night.",
            event["ogDescription"],
        ),
        (
            "The best science fiction isn't about the future, it's about the ideas "
            "we're not brave enough to think out loud yet.",
            event["twitterDescription"],
        ),
        (
            "https://alexandriasociety.org/events/fantasy-to-reality/",
            f"https://alexandriasociety.org/events/{event['slug']}/",
        ),
    ]
    for old, new in head_swaps:
        html = replace_once(html, old, new, f"head tag {old[:40]!r}")

    # The image URL appears twice — og:image and twitter:image — so this one
    # replaces every occurrence rather than just the first.
    old_img = "https://alexandriasociety.org/media/events/fantasy-to-reality-og.jpg"
    if old_img not in html:
        raise ValueError("could not find the og:image URL in the template")
    html = html.replace(old_img, event["ogImage"])

    # Declared dimensions must match the real file, or scrapers crop badly.
    og = find_og_image(HERE / "og")
    if og:
        _, og_w, og_h = og
        html = replace_once(
            html,
            '<meta property="og:image:width" content="1200" />',
            f'<meta property="og:image:width" content="{og_w}" />',
            "og:image:width",
        )
        html = replace_once(
            html,
            '<meta property="og:image:height" content="630" />',
            f'<meta property="og:image:height" content="{og_h}" />',
            "og:image:height",
        )

    # Nothing from the source event may survive into this page.
    leftovers = set(re.findall(r"fantasy-to-reality[\w./-]*", html))
    if leftovers:
        raise ValueError(f"stale Fantasy to Reality references remain: {leftovers}")

    out = HERE / "index.html"
    out.write_text(html, encoding="utf-8")

    size_mb = out.stat().st_size / 1_048_576
    print(f"wrote {out}  ({size_mb:.1f} MB)")
    print(f"  {len(books)} books, {len(readers)} readers")
    print(f"  {sum(1 for b in books if b['isbn'])} with ISBNs (covers auto-fetch)")
    print(f"  {len(used)} with a manual cover from covers/")
    print(f"  photos: {n_photos}/{PHOTO_SLOTS} real, rest placeholder")
    print(f"  video:  {'embedded' if event['youtubeId'] else 'placeholder'}")
    if og:
        print(f"  og:     {og[0].name}  {og[1]}x{og[2]}  -> upload to {event['ogImage']}")
    else:
        print("  og:     no image in og/ — meta tags declare 1200x630")

    inexact = [f for f in fuzzy if f[1]]
    if inexact:
        print("\n  covers/ files matched by name, not exactly — worth a glance:")
        for slug, title, why in inexact:
            print(f"    {slug}.* -> {title}  ({why})")

    orphans = [f[0] for f in fuzzy if not f[1]]
    if orphans:
        print("\n  WARNING: covers/ files that matched no book:")
        for slug in orphans:
            print(f"    {slug}  — check the filename against COVERS-NEEDED.md")


if __name__ == "__main__":
    main()
