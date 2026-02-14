# Speed Books: Project Vision

**Date:** 2026-02-14
**Participants:** lilbunnyrabbit, ChatGPT (earlier sessions), Claude
**Status:** Open

## Context

The Speed Reader project started as a simple tool for quickly reading video transcriptions — paste text, read it word-by-word at a configurable WPM. The project went through two iterations:

1. **v1 (Svelte)** — Original implementation
2. **v2 (React)** — Rewrite for faster development, currently in the repo

The v2 React app has a working speed reader (WPM 1-1200, ghost words, play/pause/skip) and a text editor (undo/redo, timestamp removal, newline cleanup). The token model supports prefix/value/suffix with only a basic `BOLD` emotion.

During development, the vision expanded dramatically into **Speed Books** — a platform for expressive, paced storytelling. The scope became too large and the project was shelved. Now restarting with SvelteKit, planning for the full vision built incrementally.

**Decision:** Rewrite in SvelteKit (preferred over React, better suited for the project long-term).

---

## 1. Core Concept

**"Webtoons for Books"** — A platform where books are no longer static pages but dynamic, paced experiences.

- Stories are **short and expressive**, readable in **10-15 minutes**
- Words don't just sit still — they **move, pause, and express themselves**
- A completely new writing paradigm: "expressive reading"
- Merges the simplicity of reading with the richness of pacing, emotion, and expression

**Taglines:**
- "Don't just read stories — feel them. Welcome to Speed Books."
- "Books you can read in 10 minutes. Words that make you feel."
- "Don't have time for books? Welcome to Speed Books — where stories move as fast as you do."

---

## 2. Reader Experience

### 2.1 Speed Reader Mechanics

- Words appear **one-by-one in the center of the screen** at a pace the reader controls
- Configurable **WPM (Words Per Minute)** for tailored reading speed
- Clean, focused display — no scrolling, no clutter, just words

### 2.2 Ghost Words

- Previously read words and upcoming words can briefly **"ghost" in the background**
- Provides context without breaking focus
- Configurable number of ghost words (before and after current word)

### 2.3 Navigation Like Music/Video

- **Pause/Play** — stop and resume at any point
- **Rewind/Skip** — step backward or forward through words
- **Progress bar** — scrub to any position in the text
- **Skip to start/end** — jump to beginning or end
- Readers can replay sections or slow down when needed

### 2.4 Comprehension Pauses

Constant speed reading can feel like "wearing balloons for lift, just enough to still touch the ground, but a car is pulling you along." Sometimes it's nice to have a moment to process.

- Authors can insert intentional **pauses at sentence ends or key moments**
- Optional "comprehension breaks" — subtle visual cues for reflection
- Words/sentences can linger longer or fade in slower to allow readers to "feel the pause"

### 2.5 Reader Customization

- Control overall pacing speed (WPM)
- Adjust intensity of effects and pauses
- Fine-tune the experience for fast readers, slow readers, etc.
- Reading time estimation displayed (hours/minutes/seconds)

---

## 3. Token Editing

Every word in a Speed Book is a **"token"** that can be individually customized by the author.

### 3.1 What Writers Can Control

- **Bold/emphasis** — make words visually stand out
- **Duration** — extend display time for lingering or shorten for urgency
- **Pauses** — insert intentional moments for comprehension
- **Font weight/size** — heavier for power, lighter for subtlety
- **Pacing** — control rhythm like directing a movie scene

### 3.2 Why This Matters

Token editing introduces a **completely new style of writing**. Writers focus not just on *what* words say, but *how* they are delivered. It's like:

- Directing a scene in a movie
- Composing music with dynamics (forte, piano, crescendo)
- Creating a storyboard where timing and bold visuals elevate the experience
- "Silent TV — full of expression and easy to watch"

---

## 4. Emoties System

Tokens can have **emotions** ("emoties") assigned to them, which affect how the word is displayed.

### 4.1 Core Design Principle: No Colors

Emotions are expressed through **font styling only** — weight, size, italic, spacing, timing, and subtle motion. **No colors.** This preserves the illusion of "reading a book" while introducing emotional depth. Colors would break the illusion and make it feel flashy or overwhelming.

### 4.2 Emotion Table

| Emotion | Font Styling | Size | Pacing | Motion/Effect | Emoticon | Description |
|---------|-------------|------|--------|---------------|----------|-------------|
| **Angry** | Bold, uppercase | Larger | Quick appearance | Subtle "shake" or jolt | 😡 | Force and intensity; feels like the word is yelling |
| **Shy** | Italic, lowercase | Smaller | Slow fade-in | Slight "shrink" | 😳 | Quiet, soft, almost unsure; fades in gently like a whisper |
| **Excited** | Bold, slightly stretched | Larger | Fast appearance | Subtle "bounce" | 😃 | Energetic and fun, like the word is jumping off the page |
| **Sad** | Light (thin weight), italic | Smaller | Lingering longer | Gentle "drop" | 😢 | Melancholy and slow; the word feels heavy as it falls into place |
| **Happy** | Bold, rounded font | Normal | Medium pace | Soft "pop" or slight pulse | 😊 | Warm and joyful; words have life without being overwhelming |
| **Scared** | Thin weight, uneven spacing | Normal | Fast appearance | Slight "shiver" | 😨 | Nervous or afraid; the word feels fragile, jittery entrance |
| **Excited (Urgent)** | Bold, uppercase, condensed | Larger | Rapid burst | None | 🤩 | High-energy urgency, words appear fast for excitement or panic |
| **Confident** | Bold, strong serifs | Larger | Steady appearance | None | 😎 | Stable, clear, and firm; the word appears unshakable |
| **Surprised** | Bold, slightly expanded | Larger | Sudden pop | Fast "expand" | 😮 | Abrupt and unexpected, the word bursts onto the page |
| **Calm** | Regular weight, serif | Normal | Slow fade-in and out | Gentle "breathe" pulse | 😌 | Peaceful and relaxing, with rhythmic breathing-like timing |
| **Tense** | Condensed, thin weight | Normal | Slow build-up | Tight "stretch" | 😬 | Anxiety-inducing; words feel constrained, building unease |
| **Curious** | Italic, light weight | Slightly smaller | Medium pace | Subtle "tilt" | 🧐 | Playful and inquisitive, leaning in to ask a question |
| **Whisper** | Very light weight, italic | Small | Slow fade-in and linger | None | 🤫 | Soft and delicate, like a breath barely heard |
| **Serious** | Bold, straight, sharp font | Normal | Even pace | None | 😐 | Neutral but strong; communicates authority and gravity |
| **Laughing** | Rounded, bold | Larger | Fast pop-in and pulse | Gentle "bounce" | 😂 | Fun and happy; words feel lighthearted and full of life |
| **Tired** | Thin weight, italic | Smaller | Slow appearance | Slight "sag" | 😴 | Words feel droopy, slow, and almost exhausted |
| **Angry + Sad** | Bold italic, uneven size | Normal | Slow to quick | Heavy "shake-drop" | 😠😢 | Frustration and sadness; words enter shaky and fall heavily |

### 4.3 Combination Emotions

Emotions can be combined (e.g., shy+angry, excited+scared). This creates a huge number of possible combinations. AI assistance will be critical for managing this complexity — categorizing, grouping, and suggesting combinations intelligently.

### 4.4 Key Principles

1. **Avoid Clutter** — Effects like shakes or pulses should be extremely subtle and only applied when necessary
2. **Pacing Is Key** — Timing adjustments (linger longer, quick bursts) often convey emotion better than styling alone
3. **Consistency** — Writers should use emotions sparingly and intentionally, so text doesn't feel overdone

---

## 5. Writer Experience

### 5.1 Token Editor

- Select words in the editor and assign behaviors/emotions
- **Dropdown menu** lists emotions by name and emoticon (e.g., "😡 Angry")
- **Shortcut numbers** for power users: each emotion has a number (#1 = Angry, etc.) — once writers learn them, they can type the number for speed
- **Recently used emotions** appear at the top of the dropdown for quick re-use, like saved custom colors in Microsoft Paint
- Comprehensive but uncluttered interface — visually easy to navigate

### 5.2 AI-Powered Assistance

- **Auto-detect emotions**: AI analyzes text context and suggests emotie styles (e.g., "He yelled" -> suggest Bold + Angry)
- **Auto-cadence**: AI automatically adjusts pacing and timing based on content
- **Behavior combinations**: AI helps manage the combinatorial explosion of emotion combinations
- Reduces friction for new writers while power users can override everything

### 5.3 Templates and Presets

- Pre-built emotie templates for common emotions/styles
- Apply "Sad" or "Angry" template to multiple tokens at once
- Advanced writers can tweak for custom nuance

### 5.4 Preview Mode

- Read your own Speed Book as you write it
- See exactly how tokens will appear to readers
- Real-time feedback loop for authors

---

## 6. Platform Vision

### 6.1 Speed Books Library

- A curated hub for bite-sized, expressive books
- Browse, search, and discover published Speed Books
- Perfect for micro-stories, educational materials, serialized content, poetry

### 6.2 Publishing and Monetization

- Authors publish and monetize their short expressive books
- Draft -> review -> publish workflow

### 6.3 Collaborative Features

- Real-time co-authoring / collaborative editing
- Share books as previews

### 6.4 Video Export

- Export Speed Books as video for YouTube, social media, short-form content
- "Brainrot" entertainment style content
- Bridges the gap between text and video content creation

### 6.5 Educational Use Case

- Educational books and learning materials
- Bring learning to life with pacing and emotion
- Perfect for studying, exam prep, presentations

### 6.6 Gamification

- Interactive elements like "Are you PAYING attention?" hooks
- Engaging and fun for viewers across platforms

### 6.7 Interactive Onboarding

- Demo for new users showing how tokens and emoties enhance reading
- Fun and interactive: "Here's a word — let's make it *excited*! Bold it, enlarge it, make it pop!"

### 6.8 Writer Analytics

- Insights on reader engagement: where readers pause, which sentences resonate
- Helps authors improve their expressive storytelling

---

## 7. Website Mood and Theming

Beyond standard dark/light mode:

- **"Friendly Mode"** — light, fun, accessible
- **"Writer's Mode"** — focused, minimal, distraction-free
- **Custom themes** — for different types of users
- People like choices — themes cater to different audiences

---

## 8. Demo Concept

A short example Speed Book showing the format in action:

> **[Slow Fade-In]** *"The forest was silent..."*
> Soft, italic font lingering longer for reflection.
>
> **[Quick Pop]** *"Then she heard it—* **SNAP!** *"*
> Bold, large font with a slight shake — grabs attention instantly.
>
> **[Building Emotion]** *"Her heart raced... louder... faster..."*
> Font grows slightly with each word — mimicking the heartbeat's intensity.
>
> **[Climax: Short Burst]** ***"RUN!"***
> Bold, massive, appearing fast and disappearing quickly — urgency in an instant.
>
> **[Reflective Linger]** *"And just like that, the silence returned."*
> Small, faded, slow appearance — bringing the moment full circle.

---

## 9. Key Design Principles

1. **Clean, uncluttered UI** — visually easy to navigate, never overwhelming
2. **No colors for emotions** — font styling only, preserving the book illusion
3. **Subtlety over gimmick** — effects must be purposeful, never flashy
4. **Pacing > styling** — timing conveys more emotion than visual changes alone
5. **"Like silent TV"** — full of expression and easy to watch
6. **Intuitive for readers, powerful for writers** — the reader experience should be effortless, the writing tools should be deep but learnable

---

## 10. Target Audiences

- **Writers & Creators** — craft expressive, dynamic stories that grab attention
- **Readers** — enjoy short, impactful stories in minutes, tailored for engagement
- **Educators & Storytellers** — bring learning and storytelling to life with pacing and emotion
- **Content Creators** — export to video for social platforms

---

## Key Takeaways

- Speed Books is not just a speed reader — it's a **new storytelling platform and writing paradigm**
- The core innovation is **token-level emotion and pacing control** (emoties)
- **No colors** — font styling, timing, and subtle motion create expression while preserving the book illusion
- **AI assistance** is crucial for managing complexity and lowering the barrier for writers
- Built incrementally: speed reader first, then emoties, then authoring tools, then platform

## Topics for Future Discussion

Each of these should become a dedicated brainstorm session and eventually an ADR:

1. **Technology stack** — SvelteKit setup, component library, styling approach, state management
2. **Data model / document format** — token structure, emoties schema, document versioning, file format
3. **Editor architecture** — token editor UX, emotion picker, shortcut system, AI integration points
4. **Reader engine** — rendering approach, effect/animation implementation, performance
5. **Storage & persistence** — local storage, cloud sync, import/export formats
6. **Platform features** — authentication, publishing, library/discovery, video export
7. **Theming system** — mood modes, customization, theme architecture
