# totaldebug.uk

Personal developer blog. Jekyll with a bespoke terminal/console theme (not Chirpy,
despite older references).

## Writing and style

`STYLE.md` is the canonical guide. Read it before writing or editing a post. It covers
voice (first person, en-GB, no em dashes, no emoji, sentence-case headings), front
matter, thumbnails, and diagrams. The `blog-style` skill enforces the prose rules.

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
