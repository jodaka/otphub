/**
 * Stub module that provides mock Tauri APIs for non-Tauri environments
 * (e.g., browser testing or development outside the Tauri shell).
 */

const noop = () => {};

window.__TAURI__ = window.__TAURI__ || {
  clipboardManager: {
    writeText: noop,
  },
  app: {
    onBackButtonPress: noop,
    hide: noop,
  },
  process: {
    exit: noop,
  },
  barcodeScanner: {
    checkPermissions: noop,
    requestPermissions: noop,
    scan: noop,
  },
  dialog: {
    ask: noop,
    save: noop,
    open: noop,
  },
  fs: {
    writeTextFile: noop,
  },
};

window.__TAURI_PLUGIN_OS__ = window.__TAURI_PLUGIN_OS__ || {
  type: () => 'macos',
};
