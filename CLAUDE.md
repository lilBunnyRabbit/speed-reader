# Speed Books

A platform for expressive, paced storytelling — "Webtoons for Books." Words appear one-by-one with author-controlled emotions, pacing, and styling. Currently being rewritten from React to SvelteKit.

## Project Status

The project is in the **brainstorming and planning phase**. The existing React v2 codebase (`/src/`) is reference material — the rewrite will start fresh with SvelteKit.

## Documentation (`/docs/`)

- `ROADMAP.md` - High-level feature phases
- `adrs/` - Architecture Decision Records (final decisions)
- `brainstorm/` - Ongoing design discussions and exploration

## Brainstorming Sessions

All architecture discussions and design decisions are logged in `/docs/brainstorm/`.

### Logging Instructions (for Claude)

**IMPORTANT:** Always update logs during brainstorming sessions, not just at the end.

When having design/architecture discussions:

1. **Create a log file** at `/docs/brainstorm/{YYYY-MM-DD}_{topic}.md`
2. **Update continuously** - Add new insights, decisions, and direction changes as they happen during the conversation
3. **Include these sections:**
   - Date and participants
   - Context (what prompted the discussion)
   - Topics discussed (with decisions/conclusions)
   - Key takeaways
   - Action items
   - Open questions
   - Next session topics (if applicable)

4. **Naming convention:** Use lowercase, hyphens for spaces
   - `2026-02-14_project-vision.md`
   - `2026-02-14_competitive-analysis.md`

5. **Reference previous sessions** when relevant to maintain continuity
6. **Multiple topics same day** - Create separate files per major topic

### Current Sessions
- `2026-02-14_project-vision.md` - Full Speed Books vision capture (core concept, emoties, token editing, platform)
- `2026-02-14_competitive-analysis.md` - Competitive landscape research across 4 layers
- `2026-02-14_token-system-design.md` - Token data model, authoring format, emotions, grouping, timing, storage
- `2026-02-14_emotion-system.md` - 2D Circumplex emotion grid, delivery modifiers, combinations, picker UI
- `2026-02-14_reader-engine.md` - Word display, animation tech, timing, pre-computation, high WPM scaling
- `2026-02-14_editor-ux.md` - Editor interaction patterns, paint/brush mode, properties panel, timeline, phasing
- `2026-02-15_tech-stack-hosting.md` - Full tech stack decisions, hosting, database, monetization model

## Architecture Decision Records (ADR)

When a decision is finalized, create an ADR in `/docs/adrs/`.

### When to Create ADR
- Significant structural decisions
- API design choices
- Technology selections
- Data model / format definitions
- Patterns to be used throughout codebase

### Format
```markdown
# ADR-{number}: {Title}
**Date:** YYYY-MM-DD
**Status:** Accepted | Superseded | Deprecated

## Context
## Decision
## Alternatives Considered
## Consequences
```

### Current ADRs
None yet — project is in brainstorming phase.

## Key Concepts

- **Token** - A single word with optional prefix/suffix whitespace and emotion metadata
- **Emoties** - Emotions assigned to tokens that affect visual display (font styling, size, pacing, motion effects — no colors)
- **Speed Book** - A short (10-15 min) expressive story authored with token-level emotion/pacing control
- **RSVP** - Rapid Serial Visual Presentation — the technique of displaying one word at a time
- **Ghost Words** - Faded previous/next words shown for context during reading
- **WPM** - Words Per Minute — the reader's speed setting

## Code Style

Follow the conventions established during brainstorming/ADR discussions. No code conventions decided yet.
