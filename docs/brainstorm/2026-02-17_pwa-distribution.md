# PWA & Native Distribution Strategy

**Date:** 2026-02-17
**Participants:** Human, Claude
**Previous sessions:** tech-stack-hosting (2026-02-15)

## Context

Animot will be a PWA. Question: should we also wrap it for Android/iOS app store distribution using tools like Capacitor, TWA, or PWABuilder?

## Options Researched

### 1. PWA Only ("Add to Home Screen")
- Works on all platforms, no store needed
- Instant updates, no review process, no 30% cut
- iOS limitations: no auto install prompt (Share menu only), storage quotas
- No app store discoverability

### 2. TWA (Trusted Web Activities) — Android Only
- Google's official way to put PWAs in the Play Store
- Uses actual Chrome engine (not a WebView)
- Zero code duplication — your website IS the app
- Requires Lighthouse score 80+, Digital Asset Links verification
- Free (just $25 Play Store fee)
- Auto-updates when you update the website

### 3. Capacitor (Ionic) — Android + iOS
- Wraps web app in native WebView shell
- Provides JS bridges to native APIs (camera, push, payments)
- Mature ecosystem, used by H&R Block, Burger King, etc.
- Generates actual Xcode/Android Studio projects
- Can add Swift/Kotlin native code alongside web code

### 4. PWABuilder (Microsoft)
- One-click packaging tool
- Android: uses TWA under the hood
- iOS: generates WebView wrapper (but Apple often rejects)
- Also supports Windows Store and Meta Quest

### 5. Tauri Mobile (Rust)
- Rust backend + web frontend
- Tiny binaries (~600KB), strong security
- Mobile support stable since Tauri 2.0
- Requires Rust knowledge, smaller plugin ecosystem
- Better suited for desktop-first apps

### 6. Cordova — Deprecated
- Predecessor to Capacitor, being abandoned
- Migrate to Capacitor if on Cordova

## Key Finding: Apple App Store Blocks PWA Wrappers

**Guideline 4.2 (Minimum Functionality):**
> "Your app should include features, content, and UI that elevate it beyond a repackaged website."

PWA wrappers are **routinely rejected** on iOS unless you add substantial native functionality. This effectively means:
- Android: Easy via TWA
- iOS: Need to either skip App Store or build real native features on top

### Apple PWA Timeline
- Feb 2024: Apple tried removing PWA support in EU (DMA drama), reversed after backlash
- Apr 2025: EU fined Apple €500M for DMA non-compliance
- Oct 2025: UK CMA designated Apple with Strategic Market Status
- iOS 18.2: Technically allows third-party engines in EU, but zero browsers adopted it
- **Net result: Nothing has materially changed. WebKit still rules iOS.**

## Comparison Table

| Option | Android | iOS | Complexity | Cost | Best For |
|--------|---------|-----|------------|------|----------|
| **PWA only** | ✅ | ✅ | Low | Free | Content platforms, MVPs |
| **TWA** | ✅ | ❌ | Low | $25 | Android Play Store presence |
| **Capacitor** | ✅ | ✅ | Medium | $99/yr (iOS) | Need native APIs |
| **PWABuilder** | ✅ | ⚠️ | Low | $25-$99 | Quick packaging |
| **Tauri** | ✅ | ✅ | High | $99/yr (iOS) | Performance-critical, Rust |

## Decision

**PWA first, Capacitor upgrade later.**

- Build as a high-quality PWA
- When the time comes for app store distribution, use Capacitor to wrap it
- No need to overthink this now — PWA doesn't close any doors

## Key Takeaways

- PWA covers everything Animot needs for launch (text rendering, animations, offline, web push)
- Capacitor is the best wrapper option when native distribution is needed
- Android is easy (TWA or Capacitor), iOS requires native enhancements to pass App Store review
- Apple actively blocks pure PWA wrappers (Guideline 4.2) — will need real native features added
- Building PWA-first is the right call; wrapping comes later when traction justifies it
