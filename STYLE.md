# Writing style guide

How I write posts for [totaldebug.uk](https://totaldebug.uk), so the blog stays
consistent over the years. This is my house style. I lint posts against it with Vale and
markdownlint (config in this repo) before publishing, which keeps the tone and formatting
steady across hundreds of posts.

## Voice

- First person and conversational. "I", "you", and contractions are all welcome.
- Active voice by default.
- Short paragraphs. Bold a key term occasionally, not whole sentences.
- Cut filler and hype. If a sentence survives being deleted, delete it. I avoid crutches
  like "in order to", "it's important to note", and "in the following sections".
- Tell the backstory once. No repeating it across sections.

## Spelling and grammar

- British English (en-GB): analyse, organise, categorise, optimise, colour, behaviour,
  licence (the noun). I keep "program", which is correct in en-GB for software.
- Proofread for the usual slips: its/it's, comma splices, double spaces.

## Punctuation and formatting

- Sentence case for headings ("How does it work?", not "How Does It Work?").
- No em dashes. I think a comma, colon, parentheses, or full stop reads more cleanly. A
  spaced hyphen is an acceptable last resort.
- No emoji. Where I want a small visual marker I use a Font Awesome icon instead. The
  theme bundles Font Awesome 6.5.1, so `<i class="fas fa-star fa-fw"></i>` works directly
  in Markdown (use `fas`/`far`/`fab`; `fa-fw` keeps list icons aligned).
- Code goes in fenced blocks with a language set. I test every command and snippet before
  publishing, because a broken sample is worse than no sample.

## Posts

- File: `_posts/YYYY-MM-DD-kebab-title.md`.
- Front matter (Chirpy):

  ```yaml
  ---
  title: "Sentence-case title"
  date: 2026-06-16 10:00:00 +0100   # +0100 BST (summer), +0000 GMT (winter)
  image:
    path: assets/img/posts/<post-slug>/thumb.png
  categories: [Primary, Secondary]   # max 2, Title Case, reuse existing where possible
  tags: [lowercase]
  pin: false
  toc: true
  comments: true
  math: false
  mermaid: false
  ---
  ```

- Images live under `assets/img/posts/<post-slug>/`.
- Internal links use the Liquid tag, not a raw URL:
  `[text]({% post_url 2025-10-29-ditch-the-manual-chore-automating-releases-and-versions %})`.
- Categories: keep the taxonomy tight and reuse existing ones (Automation, Git, Open
  Source, Home Assistant, Linux, Docker, and so on). Two max, tags lowercase.

## Thumbnails

Every post needs a `thumb.png` at `assets/img/posts/<slug>/thumb.png`. The **style** stays
consistent across posts: a dark base (`#1a1d23` to `#242930`) with frosted-glass rounded
tiles holding white Font Awesome icons, a bold uppercase title, and a small subtitle. The
**colour** comes from two brand-coloured glows over that dark base, burnt orange `#f56600`
and teal `#00b2e8`, weighted to the sentiment of the post: warm or community posts lean
orange-dominant, technical posts lean teal-dominant, and general posts sit balanced.
Keeping the dark base constant is what holds the set together.

I build each thumbnail from an HTML mock rather than by hand:

1. Copy an existing `thumb.html` into the new post's image dir and edit the title,
   subtitle, and the three tile icons.
2. Render it at 1200x630:

   ```bash
   dir="assets/img/posts/<slug>"
   npx playwright screenshot --viewport-size=1200,630 --wait-for-timeout=2800 \
     "file://$PWD/$dir/thumb.html" "$dir/thumb.png"
   ```

3. Keep the `thumb.html` next to the PNG so it can be regenerated later.

## Keeping it consistent

The rules above are enforced with Vale (prose) and markdownlint (formatting), wired into
pre-commit.

```bash
# one-time
brew install vale && vale sync
pre-commit install

# before committing
pre-commit run --all-files
```

Local dev: `bundle install` then `bundle exec jekyll serve`.
