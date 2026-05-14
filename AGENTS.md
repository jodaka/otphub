# OTPHub Project - Agent Guide

## Project Overview

OTPHub is a simple TOTP (Time-based One-Time Password) code generator application built with **Tauri v2**. The app generates 2FA codes for multiple accounts with a clean, minimal UI.

**Current Status:** 
- Desktop: macOS (primary), Windows, Linux
- Mobile: Android (initialized), iOS

## Architecture

### Frontend (JavaScript/ES Modules - No Bundler)
- **Entry:** `src/index.html`
- **Main:** `src/js/main.js` - App initialization with platform detection
- **Components:**
  - `src/components/common/tokens/` - Token display and TOTP generation
  - `src/components/desktop/menu/` - Window controls (macOS-style, disabled on mobile)
  - `src/components/desktop/dropzone/` - File import for 2FAS exports (disabled on mobile)
  - `src/components/common/emptyScreen/` - Empty state UI
  - `src/components/common/scannerButton/` - a dedicated button that fires camera for QR codes reading
- **Libraries:**
  - `otpauth.esm.js` - TOTP/HOTP generation (bundled)
  - `tinykeys.module.js` - Keyboard shortcuts

### Backend (Rust/Tauri v2)
- **Library:** `src-tauri/src/lib.rs` - Main library with mobile entry point
- **Binary:** `src-tauri/src/main.rs` - Desktop binary that calls `otphub_lib::run()`
- **Tauri Version:** v2.10.3
- **Plugins:**
  - `tauri-plugin-os` - Platform detection (`os:allow-os-type`)
  - `tauri-plugin-clipboard-manager` - Clipboard operations
  - `tauri-plugin-process` - App exit/restart
  - `tauri-plugin-window-state` - Window position/state persistence (desktop only)

### Storage
- Uses `localStorage` for token persistence (via `src/js/storage.js`)
- Debug tokens are used when storage is empty

## Key Files

| File | Purpose |
|------|---------|
| `src-tauri/tauri.conf.json` | Tauri configuration, window settings, `withGlobalTauri: true` |
| `src-tauri/Cargo.toml` | Rust dependencies, `[lib]` section for mobile support |
| `src-tauri/src/lib.rs` | Main library with `#[cfg_attr(mobile, tauri::mobile_entry_point)]` |
| `src-tauri/capabilities/desktop.json` | Permissions for desktop platforms |
| `src-tauri/capabilities/mobile.json` | Permissions for Android/iOS |
| `src/components/dropzone/parsers/2faa.js` | Parser for 2FAS backup files |
| `src/components/tokens/otpauth.esm.js` | OTP generation library |

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

**Clipboard (`src/components/tokens/tokens.js`):**
```javascript
const { writeText } = window.__TAURI__.clipboardManager;

// Usage
await writeText(token.token);
```

**Process/App Control (`src/components/menu/menu.js`):**
```javascript
const { process, app } = window.__TAURI__;

const appExit = () => process.exit();
const appMinimize = () => app.hide();
```

### Plugin Configuration

Plugins are configured in `src-tauri/Cargo.toml`:
```toml
[dependencies]
tauri-plugin-os = "2.3.2"
tauri-plugin-clipboard-manager = "2.3.2"
tauri-plugin-process = "2.3.1"

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
        .plugin(tauri_plugin_os::init());

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_window_state::Builder::default().build());
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

All UI components under ./components are devided between mobile and desktop (that's true for both CSS and JS). In ./js/main.js we load only necessary CSS/JS for the current platform. 

### Desktop
- Frameless transparent window
- Custom traffic light buttons (close/minimize)
- Drag-drop file import for 2FAS exports
- Keyboard shortcuts (Cmd+Q, Ctrl+Q)
- Window state persistence

### Mobile (Android/iOS)
- Native mobile UI
- Menu hidden (`document.documentElement.classList.add('mobile')`)
- Dropzone disabled (drag-drop not applicable)
- Viewport meta tag for proper scaling

## Types

JSDoc should be used everywhere. Types that are used in more than one place should be place info ./js/types.js

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

# Lint & Format
pnpm lint:fix
pnpm format
```

## Android Structure

Android project generated in `src-tauri/gen/android/`:
- Standard Gradle project structure
- `app/src/main/AndroidManifest.xml` - App manifest
- `MainActivity` - Entry point

## Adding New Tauri Plugins

To add a new plugin (example: barcode-scanner):

1. **Install Rust dependency** in `src-tauri/Cargo.toml`:
   ```toml
   tauri-plugin-barcode-scanner = "2"
   ```

2. **Initialize plugin** in `src-tauri/src/lib.rs`:
   ```rust
   .plugin(tauri_plugin_barcode_scanner::init())
   ```

3. **Install JS dependency** (provides TypeScript types, but runtime uses global):
   ```bash
   pnpm add @tauri-apps/plugin-barcode-scanner
   ```

4. **Add permissions** in `src-tauri/capabilities/mobile.json`:
   ```json
   "permissions": [
     "barcode-scanner:allow-scan",
     "barcode-scanner:allow-cancel"
   ]
   ```

5. **Use in JavaScript** via global API:
   ```javascript
   // With withGlobalTauri: true in tauri.conf.json
   const { scan, Format } = window.__TAURI__.barcodeScanner;
   
   const result = await scan({ 
     windowed: true, 
     formats: [Format.QRCode] 
   });
   ```

## QR Code Scanning for Android

The recommended approach for QR code scanning is the **official Tauri barcode-scanner plugin**, which:
- Uses native Android camera APIs
- Returns raw QR content to JavaScript
- No third-party JavaScript libraries needed
- Exposed via `window.__TAURI__.barcodeScanner` when `withGlobalTauri: true`

## Development Guidelines

- Use vanilla JavaScript with ES modules (no bundler)
- Access Tauri plugins via global `window.__TAURI__` and `window.__TAURI_PLUGIN_*__`
- Always check platform (`window.__TAURI_PLUGIN_OS__.type()`) for platform-specific features
- Keep UI minimal and performant
- Store sensitive data (secrets) in secure storage for production
- Use CSS custom properties for theming
- Add `mobile` class to root element for mobile-specific CSS
- all JS/HTML/CSS files should be linted and formatted with biome
