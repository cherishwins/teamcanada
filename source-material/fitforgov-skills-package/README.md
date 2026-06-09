# Fit For Gov Skills — Portable Package

This bundle contains the three Fit For Gov skills, ready to drop into your repo and
use with any AI coding agent (Cursor, Windsurf, Cline, Zed, Claude Code, GitHub
Copilot, etc.). It also works when you paste a SKILL.md straight into a chat.

## What's inside

```
AGENTS.md                          ← the router. Tells an agent when to load which skill.
README.md                          ← this file.
fitforgov-brand-kit/
  SKILL.md                         ← look + voice: colors, fonts, seal, banned words
  references/
    brand-guide.html               ← open in a browser to see the full spec
    v0-prompt.md                   ← paste-ready prompt for building pages
  assets/
    logo-seal*.png                 ← the bronzed seal at every size
    favicon-source.png             ← source for favicon generation
fitforgov-narrative/
  SKILL.md                         ← the story: positioning, promise, signature phrases
  references/
    canonical-facts.md             ← single source of truth for every number you cite
    narrative-strands.md           ← the active angles (water threat, Hamilton, SecTor)
    worked-examples.md             ← good vs. bad, applied
fitforgov-persuasion/
  SKILL.md                         ← how the words sell, ethically
  references/
    rewriting-patterns.md          ← weak→strong rewrite patterns
    worked-examples.md             ← conversion examples
```

## How to install it

### Option A — Cursor / Windsurf / Cline / Zed (the AGENTS.md standard)

1. Copy the three skill folders into your repo at `.fitforgov/skills/`.
2. Copy `AGENTS.md` to the **root** of your repo.
   - Cursor also reads `.cursor/rules/`; Windsurf reads `.windsurf/rules/`. If your
     tool prefers those, drop a one-line file there that says:
     "Follow the instructions in /AGENTS.md and load skills from
     .fitforgov/skills/ as directed."
3. That's it. When you ask the agent to build a Fit For Gov page, it reads AGENTS.md,
   sees the routing table, and opens the right SKILL.md before writing code.

### Option B — Claude Code

1. Copy the three skill folders into your repo (anywhere; `.fitforgov/skills/` is fine).
2. Rename or copy `AGENTS.md` to `CLAUDE.md` at the repo root (Claude Code reads
   `CLAUDE.md` automatically on every session). The content is identical.

### Option C — Paste into any chat (Claude, Gemini, ChatGPT)

Open the SKILL.md you need, copy its entire contents, and paste it at the top of your
conversation with: "Follow this brand system for everything that follows." For tasks
that need a logo, also upload `assets/logo-seal-256.png`.

### Option D — v0.dev page builds

Open `fitforgov-brand-kit/references/v0-prompt.md`, copy the whole thing into v0, and
upload `fitforgov-brand-kit/assets/logo-seal-256.png` as a reference image.

## The one thing to remember

`fitforgov-brand-kit` is always loaded for Fit For Gov work. Stack `narrative` on top
when writing new content; stack `persuasion` on top when the goal is to make someone
call. The AGENTS.md routing table handles this automatically for agents that read it.

## Keeping it in sync

These files are a snapshot. The canonical versions live in your Claude skills. When you
update a skill in Claude, re-export and replace the folder here so your IDE agent and
your Claude sessions never drift apart. A short note in your repo (e.g. a dated line at
the bottom of AGENTS.md) helps you remember which snapshot you're on.
