# OTPHub Project - Agent Guide

## Project Overview

OTPHub is a minimal TOTP (Time-based One-Time Password) code generator application built with **Tauri v2**. The app generates 2FA codes for multiple accounts with a clean, minimal UI.

**Current Status:**
- Desktop: macOS (primary), Windows, Linux
- Mobile: Android (initialized), iOS

**Version:** 1.0.3

## Architecture

### Frontend (JavaScript/ES Modules - No Bundler)
- **Entry:** `src/index.html`
- **Main:** `src/js/main.js` - App initialization with platform detection
- **Components (Common):**
  - `src/components/common/tokensTab/` - Token display, TOTP generation, and countdown
  - `src/components/common/editTokensTab/` - Token reordering and deletion
  - `src/components/common/emptyTokensTab/` - Empty state UI with import hint
  - `src/components/common/settingsTab/` - Export/import and QR code scanning (mobile)
  - `src/components/common/tabs/` - Bottom tab navigation (OTP / Edit / Settings)
  - `src/components/common/scanQRcode/` - Mobile QR code scanner using Tauri barcode-scanner plugin
- **Components (Desktop Only):**
  - `src/components/desktop/menu/` - Custom window controls (close/minimize) and drag region
- **JavaScript Modules:**
  - `src/js/main.js` - App bootstrap, tab routing, platform-specific init
  - `src/js/types.js` - Shared JSDoc type definitions (`Token`)
  - `src/js/storage.js` - Token persistence via Tauri `tauri-plugin-store`
  - `src/js/utils.js` - Token validation, file parsing, CSS injection, platform detection
  - `src/js/id.js` - Unique ID generation for token instances
  - `src/js/colors.js` - HSL color manipulation for token card gradients
  - `src/js/export.js` - JSON export with save dialog and hotkey registration
  - `src/js/import.js` - JSON/2FAS file import with merge logic and hotkey registration
  - `src/js/importTokens.js` - Import format parsers (2FAS, plain array, nested objects)
  - `src/js/stub.js` - Tauri API stubs for non-Tauri environments (testing/dev)
- **Libraries:**
  - `src/js/otpauth.esm.js` - TOTP/HOTP generation (bundled)
  - `src/js/tinykeys.module.js` - Keyboard shortcuts

### Backend (Rust/Tauri v2)
- **Library:** `src-tauri/src/lib.rs` - Main library with mobile entry point
- **Binary:** `src-tauri/src/main.rs` - Desktop binary that calls `otphub_lib::run()`
- **Tauri Version:** v2.10.3
- **Plugins:**
  - `tauri-plugin-os` - Platform detection (`os:allow-os-type`)
  - `tauri-plugin-clipboard-manager` - Clipboard operations
  - `tauri-plugin-process` - App exit/restart
  - `tauri-plugin-dialog` - Native save/open dialogs
  - `tauri-plugin-fs` - File system read/write
  - `tauri-plugin-store` - Persistent key-value storage (replaces localStorage)
  - `tauri-plugin-barcode-scanner` - QR code scanning (mobile only)
  - `tauri-plugin-mcp-bridge` - MCP bridge (debug builds only)
  - `tauri-plugin-window-state` - Window position/state persistence (desktop only)

### Storage
- Uses `tauri-plugin-store` (`tokens.json`) for token persistence (via `src/js/storage.js`)
- Debug tokens are commented out in `storage.js` and can be enabled for development

## Folder Structure

```
├── src/
│   ├── index.html                    # App entry HTML
│   ├── styles.css                    # Global styles
│   ├── FiraCode-VF.woff2             # Monospace font for token display
│   ├── img/
│   │   └── otphub.svg                # App logo
│   ├── js/
│   │   ├── main.js                   # App initialization and tab routing
│   │   ├── types.js                  # Shared JSDoc types
│   │   ├── storage.js                # Token persistence (tauri-plugin-store)
│   │   ├── utils.js                  # Validation, parsing, platform detection
│   │   ├── id.js                     # Unique ID generation
│   │   ├── colors.js                 # HSL color utilities for gradients
│   │   ├── export.js                 # Export tokens to JSON
│   │   ├── import.js                 # Import tokens from file dialog
│   │   ├── importTokens.js           # Import format parsers
│   │   ├── stub.js                   # Tauri API stubs for dev/testing
│   │   ├── otpauth.esm.js            # OTP generation library
│   │   └── tinykeys.module.js        # Keyboard shortcuts library
│   └── components/
│       ├── common/                   # Shared UI components (all platforms)
│       │   ├── common.css            # Common component styles
│       │   ├── tabs/
│       │   │   ├── tabs.js           # Bottom tab navigation
│       │   │   └── tabs.css
│       │   ├── tokensTab/
│       │   │   ├── tokensTab.js      # Token list with live countdown
│       │   │   ├── tokensTab.css
│       │   │   └── token.js          # Single token card (TOTP + UI)
│       │   ├── editTokensTab/
│       │   │   ├── editTokensTab.js  # Token reorder/delete UI
│       │   │   ├── editTokensTab.css
│       │   │   └── editToken.js      # Single editable token card
│       │   ├── emptyTokensTab/
│       │   │   ├── emptyTokensTab.js # Empty state with import hint
│       │   │   └── emptyTokensTab.css
│       │   ├── settingsTab/
│       │   │   ├── settingsTab.js    # Settings: export, import, QR scan
│       │   │   └── settingsTab.css
│       │   └── scanQRcode/
│       │       └── scanQRcode.js     # Mobile QR scanner wrapper
│       └── desktop/                  # Desktop-only UI components
│           ├── desktop.css           # Desktop-specific layout styles
│           └── menu/
│               ├── menu.js           # Custom traffic light buttons
│               └── menu.css
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs                    # Main Tauri library (mobile entry point)
│   │   └── main.rs                   # Desktop binary entry point
│   ├── Cargo.toml                    # Rust dependencies and plugin versions
│   ├── tauri.conf.json               # Tauri window config, withGlobalTauri: true
│   ├── capabilities/
│   │   ├── desktop.json              # Desktop permissions
│   │   └── mobile.json               # Mobile permissions
│   └── icons/                        # App icons (macOS, Windows, iOS, Android)
├── scripts/
│   └── bump-version.mjs              # Version bump helper
├── package.json                      # pnpm scripts and JS dependencies
├── biome.json                        # Biome lint/format config
└── AGENTS.md                         # This file
```

## Key Files

| File | Purpose |
|------|---------|
| `src-tauri/tauri.conf.json` | Tauri configuration, window settings, `withGlobalTauri: true` |
| `src-tauri/Cargo.toml` | Rust dependencies, `[lib]` section for mobile support |
| `src-tauri/src/lib.rs` | Main library with `#[cfg_attr(mobile, tauri::mobile_entry_point)]` |
| `src-tauri/capabilities/desktop.json` | Permissions for desktop platforms |
| `src-tauri/capabilities/mobile.json` | Permissions for Android/iOS |
| `src/js/otpauth.esm.js` | OTP generation library |
| `src/js/types.js` | Shared JSDoc type definitions |
| `src/js/main.js` | App bootstrap and tab routing |
| `src/js/storage.js` | Token persistence using `tauri-plugin-store` |

## Tauri Plugin Usage (Global API - No Bundler)

Since this project doesn't use a bundler, all Tauri plugins are exposed via **global variables** through `window.__TAURI__` and `window.__TAURI_PLUGIN_*__`.

### Accessing Plugins in JavaScript

```javascript
// Core Tauri APIs
const { app, process } = window.__TAURI__;

// Plugin-specific APIs
const osType = window.__TAURI_PLUGIN_OS__.type();
const { writeText } = window.__TAURI__.clipboardManager;

// Platform detection (used throughout the app)
const isMobile = osType === 'android' || osType === 'ios';
```

### Current Plugin Usage in Codebase

**Platform Detection (`src/js/main.js`):**
```javascript
const osType = window.__TAURI_PLUGIN_OS__.type();
const isMobile = osType === 'android' || osType === 'ios';
if (isMobile) {
  document.documentElement.classList.add('mobile');
} else {
  new Menu(); // Desktop-only menu
}
```

**Clipboard (`src/components/common/tokensTab/tokensTab.js`):**
```javascript
const { writeText } = window.__TAURI__.clipboardManager;

// Usage
await writeText(token.token);
```

**Process/App Control (`src/components/desktop/menu/menu.js`):**
```javascript
const { process, app } = window.__TAURI__;

const appExit = () => process.exit();
const appMinimize = () => app.hide();
```

**Storage (`src/js/storage.js`):**
```javascript
const { Store } = window.__TAURI_PLUGIN_STORE__;
const store = await Store.load('tokens.json');
await store.set('tokens', tokens);
await store.save();
```

### Plugin Configuration

Plugins are configured in `src-tauri/Cargo.toml`:
```toml
[dependencies]
tauri-plugin-os = "2.3.2"
tauri-plugin-clipboard-manager = "2.3.2"
tauri-plugin-process = "2.3.1"
tauri-plugin-dialog = "2"
tauri-plugin-fs = "2"
tauri-plugin-store = "2"
tauri-plugin-barcode-scanner = "2"
tauri-plugin-mcp-bridge = "0.10"

[target.'cfg(not(any(target_os = "android", target_os = "ios")))'.dependencies]
tauri-plugin-window-state = "2.4.1"
```

Plugins are initialized in `src-tauri/src/lib.rs`:
```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_store::Builder::new().build());

    #[cfg(mobile)]
    {
        builder = builder.plugin(tauri_plugin_barcode_scanner::init());
    }

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_window_state::Builder::default().build());
    }

    builder = builder
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init());

    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(tauri_plugin_mcp_bridge::init());
    }

    builder.run(tauri::generate_context!())
}
```

## Capabilities (Tauri v2 Permission System)

Tauri v2 uses capability files instead of the v1 allowlist:

**Desktop (`src-tauri/capabilities/desktop.json`):**
- Core window operations (drag, minimize, maximize, close)
- OS info, clipboard, process control
- Desktop-only window state management

**Mobile (`src-tauri/capabilities/mobile.json`):**
- Limited window operations (show/hide/close)
- OS info, clipboard, process control
- No window state (not applicable on mobile)

## Platform-Specific Behavior

All UI components under `./components` are divided between mobile and desktop (that's true for both CSS and JS). In `./js/main.js` we load only necessary CSS/JS for the current platform.

### Desktop
- Frameless transparent window
- Custom traffic light buttons (close/minimize)
- Drag-drop file import for 2FAS exports
- Keyboard shortcuts (Cmd+Q, Ctrl+Q, Cmd+E, Ctrl+E, Cmd+I, Ctrl+I)
- Window state persistence

### Mobile (Android/iOS)
- Native mobile UI
- Menu hidden (`document.documentElement.classList.add('mobile')`)
- Viewport meta tag for proper scaling
- QR code scanning via `tauri-plugin-barcode-scanner`

## Types

JSDoc should be used everywhere. Types that are used in more than one place should be placed in `./js/types.js`.

## Build Commands

```bash
# Development - Desktop
pnpm dev

# Development - Android
pnpm dev:android

# Build - Desktop
pnpm build

# Build - Android
pnpm build:android

# Release (bumps version + builds desktop)
pnpm release

# Release Android (bumps version + builds APK)
pnpm release:android

# Lint & Format
pnpm lint:fix
pnpm format
```

## Android Structure

Android project generated in `src-tauri/gen/android/`:
- Standard Gradle project structure
- `app/src/main/AndroidManifest.xml` - App manifest
- `MainActivity` - Entry point

## QR Code Scanning for Mobile

The app uses the **official Tauri barcode-scanner plugin** for mobile QR code scanning:
- Uses native camera APIs
- Returns raw QR content to JavaScript
- No third-party JavaScript libraries needed
- Exposed via `window.__TAURI__.barcodeScanner` when `withGlobalTauri: true`

## Development Guidelines

- Use vanilla JavaScript with ES modules (no bundler)
- Access Tauri plugins via global `window.__TAURI__` and `window.__TAURI_PLUGIN_*__`
- Always check platform (`window.__TAURI_PLUGIN_OS__.type()`) for platform-specific features
- Keep UI minimal and performant
- Use `tauri-plugin-store` for persistence (not `localStorage`)
- Use CSS custom properties for theming
- Add `mobile` class to root element for mobile-specific CSS
- All JS/HTML/CSS files should be linted and formatted with Biome
