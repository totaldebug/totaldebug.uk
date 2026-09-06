# totaldebug.uk

Personal developer blog. Jekyll with a bespoke terminal/console theme (not Chirpy,
despite older references).

## Writing and style

`STYLE.md` is the canonical guide. Read it before writing or editing a post. It covers
voice (first person, en-GB, no em dashes, no emoji, sentence-case headings), front
matter, thumbnails, and diagrams. The `blog-style` skill enforces the prose rules.

## Social promo pack

Every new post gets a private promo pack in `_social/<post-slug>/`, alongside its
thumbnail. This is not optional and it is easy to forget: a post is not finished until
the pack exists. It holds `posts.md` (per-platform drafts for LinkedIn, the relevant
subreddits, Hacker News and Mastodon) and a 1080x1080 `social-square.png` with its
`social-square.html` source, which is a square re-cut of the post's `thumb.png` reusing
the same title, icons and accent. Start from `_social/_template/` and follow the "Social
promo pack" section of the `blog-style` skill. `_social/` is excluded from the build and
never ships to the public site.

## Diagrams

Diagrams are Mermaid, and all styling lives in `_includes/mermaid.html` (themed from the
site's own CSS tokens, light/dark aware, click-to-zoom). Do not style diagrams in the
post. Author them per the Diagrams section of `STYLE.md`: `mermaid: true` in the front
matter, grouped `subgraph`s with the brand-accent tints, and the `<table class="di">`
icon-node skeleton with Iconify icons tinted to brand accents under
`assets/img/posts/<slug>/ic/`.

## Local dev

The active Homebrew Ruby (4.0.6) has broken OpenSSL, so build with rbenv's 3.3.0:

```bash
RBENV_VERSION=3.3.0 rbenv exec bundle install
RBENV_VERSION=3.3.0 rbenv exec bundle exec jekyll serve
```

Run `pre-commit run --all-files` before committing (Vale, markdownlint, and hygiene
hooks).
