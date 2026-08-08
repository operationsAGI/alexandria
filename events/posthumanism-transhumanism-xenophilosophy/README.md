# Posthumanism, Transhumanism & Xenophilosophy — event page

Duplicate of the *Fantasy to Reality* event page, rebuilt with this event's data.

```
build.py           generator — reads the inputs below, writes index.html
merge_links.py     merges updated links from a partial CSV into books.csv
event.json         event metadata + the copy that still needs writing
books.csv          the reading list (Book Name, Author, Recommender, Amazon Purchase Link)
photos/            drop 3 images here; empty = placeholder tiles
covers/            manual book covers — see COVERS-NEEDED.md
og/                the social-card image — NOT embedded, must be hosted
COVERS-NEEDED.md   cover status, naming rules, and the link-merge log
index.html         ← the deliverable, 4.3 MB, fully self-contained
```

## Merging link updates

Partial sheets ("here are corrected links for the books missing covers") go
through `merge_links.py`, not a hand-edit:

```bash
python3 merge_links.py "../../Books with no covers - Sheet1.csv"
```

It updates the **link column only**, matched on title, and backs up `books.csv`
first. Everything else in the master — author, recommender, row order — is left
alone on purpose: these extracts are partial, and their other columns can carry
annotations that would corrupt the master. The sheet from 8 Aug, for instance,
had a "Recommended by" cell reading `Jeremy Nixon + Clovis (2 tiles, 1 file)`
where the master correctly holds two separate rows.

## Rebuild

```bash
python3 build.py
```

Re-run after any change to `event.json`, `books.csv`, or `photos/`. It reads
`../Fantasy to Reality/index.html` as the template each time, so that file
must stay where it is.

## Preview

```bash
python3 -m http.server 8777
```

Then open <http://localhost:8777>. (Opening `index.html` via `file://` also
works, but a local server matches production more closely.)

## Still to fill in

| Where | What |
|---|---|
| `event.json` → `body[]` | two `PLACEHOLDER` recap paragraphs |
| `event.json` → `metaDescription` | `PLACEHOLDER` — shows in search results and social cards |
| `event.json` → `youtubeId` | `null` → renders a "Video coming soon" tile. Set the 11-char ID to swap in the real card |
| `photos/` | empty → three "Photo coming soon" tiles. Add 3 images to replace them |
| `covers/` | 1 book left without a cover — *Divine Harmony*. See `COVERS-NEEDED.md` |
| `og/` image | **must be uploaded to the web server** — see below |

## The social-card image

`og/posthumanism-transhumanism-xenophilosophy-og.png` (1676×924) is the only
asset on this page that is *not* self-contained. Unlike the photos, covers and
videos, it cannot be inlined: Facebook, X, LinkedIn and Slack all reject
`data:` URIs for `og:image`, so it has to be fetched over HTTP.

Upload it, unrenamed, so it resolves at exactly:

```
https://alexandriasociety.org/media/events/posthumanism-transhumanism-xenophilosophy-og.png
```

That is the URL baked into both `og:image` and `twitter:image`. Until the file
is live there, shared links will render without a preview image. The filename
already matches the URL, so it's a straight drop into `/media/events/`.

The build reads the file's real pixel dimensions and writes them into
`og:image:width` / `og:image:height`. Replacing the image with a different size
and rebuilding keeps those in sync — declared dimensions that don't match the
file cause scrapers to crop badly or skip the preview.

The recap paragraphs are carried over verbatim from *Fantasy to Reality*. Note
that the first one opens "the people who read **it** like a blueprint" — in the
original, "it" pointed back at science fiction in the hero line. This page's
hero line is "great conceptions of the future", so the pronoun no longer has a
referent. Worth a one-word edit if you want it to read cleanly.

## How the build works

There is no JSX source for this site anywhere on this machine — only the
pre-built Vite bundle, one minified line of React. `build.py` treats that
bundle as a template and swaps the data literals inside it:

| Literal | Holds |
|---|---|
| `Ze={…}` | event metadata |
| `Ju=[…]` | the book list |
| `Wu=[…]` | the Events dropdown in the nav |
| `<h1>` children | the two-line hero title |
| gallery `<img>` | three inlined base64 photos |
| video card call | wrapped so a null `youtubeId` renders a placeholder |
| `<head>` | title, description, `og:*`, `twitter:*` |

Every swap either matches or raises — the script will not silently produce a
page with stale *Fantasy to Reality* content in it.

### Two behaviours worth knowing

**Amazon links are normalised.** The sheet has a mix of bare `/dp/` URLs and
sprawling ones with tracking params; the build reduces both to
`https://www.amazon.com/dp/<ASIN>`. Column values that aren't URLs at all
(one row says `No author info`) become no link.

**Covers come from OpenLibrary, by ISBN.** Only real ISBN-10s work — Amazon
`B0…` ASINs aren't ISBNs, so those books get the gradient tile instead.
The request appends `?default=false`: without it OpenLibrary answers "no
cover" with a 1×1 transparent pixel rather than a 404, the page's `onError`
handler never fires, and you get a blank rectangle. With it, 16 books that
would have rendered blank now fall back to the gradient tile correctly.

Current split: 59 auto-fetched, 20 from `covers/`, 1 gradient tile, 80 total.

**Manual covers win.** Any file in `covers/` that resolves to a book title is
inlined as `coverOverride`, skipping OpenLibrary entirely — useful both for the
books with no cover and for replacing an auto-fetched cover you don't like.
Filenames are matched exactly first, then by subtitle, then by close spelling;
see `COVERS-NEEDED.md` for the rules. Inexact matches are printed at build time
and unresolvable files raise a warning, so a typo'd filename fails loudly
rather than silently doing nothing.
