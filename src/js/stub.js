window.__TAURI__ = window.__TAURI__ || {
  clipboardManager: {
    writeText: () => {},
  },
  app: {
    onBackButtonPress: () => {},
    hide: () => {},
  },
  process: {
    exit: () => {},
  },
  barcodeScanner: {
    checkPermissions: () => {},
    requestPermissions: () => {},
    scan: () => {},
  },
};

window.__TAURI_PLUGIN_OS__ = window.__TAURI_PLUGIN_OS__ || {
  type: () => 'macos',
};

export const forTesting = 'only';
