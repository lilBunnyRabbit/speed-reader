# Speed Books Roadmap

High-level feature phases for the Speed Books project. This is a directional guide, not a timeline.

## Phase 1: Foundation

Establish the core project and replicate the existing speed reader functionality in SvelteKit.

- SvelteKit project setup (routing, styling, theming)
- Core speed reader engine (word-by-word display, WPM control)
- Ghost words (contextual previous/next word display)
- Playback controls (play, pause, rewind, skip, progress bar)
- Basic token model (word with prefix/suffix whitespace)
- Text input / paste interface
- Text cleanup tools (remove timestamps, strip newlines)
- Dark/light mode

## Phase 2: Expressiveness

Introduce the emoties system and token-level styling that makes Speed Books unique.

- Emoties system: emotion-to-display mapping (font styling, size, pacing, motion)
- Core emotion set (angry, shy, excited, sad, happy, calm, whisper, etc.)
- Token pacing: per-word duration overrides, comprehension pauses
- Subtle motion effects (shake, bounce, pulse, drop — tasteful and optional)
- Combination emotions (shy+angry, etc.)
- Reader-side customization (intensity of effects, pause duration)

## Phase 3: Authoring

Build the writer-facing tools for creating Speed Books.

- Token editor UI: select words, assign emotions and behaviors
- Emotion dropdown with emoticon indicators and shortcut numbers
- Recently used emotions (quick-access, MS Paint-style)
- Emotie templates/presets for common patterns
- Document management (create, save, load, edit)
- Preview mode (read your own Speed Book as you write)
- AI-powered token assistance (auto-detect emotion, suggest styles, auto-cadence)

## Phase 4: Platform

Transform from a tool into a platform where creators publish and readers discover.

- User accounts and authentication
- Speed Books Library: browse, search, discover published books
- Publishing flow (draft -> review -> publish)
- Sharing (links, embeds, social previews)
- Website mood themes ("Friendly Mode", "Writer's Mode", custom themes)
- Interactive demo/onboarding for new users
- Video export for social content (YouTube, short-form)

## Phase 5: Intelligence

AI-enhanced features and analytics for deeper engagement.

- AI-assisted writing: cadence suggestions, emotion detection, pacing optimization
- Writer analytics: reader engagement data, pause points, resonance metrics
- Reader recommendations: personalized Speed Book suggestions
- Collaborative editing / real-time co-authoring
- Gamification elements (interactive reading hooks)
- Educational tools and integrations
