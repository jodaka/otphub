window.__TAURI__ = window.__TAURI__ || {
  clipboardManager: {
    writeText: () => {},
  },
};

window.__TAURI_PLUGIN_OS__ = window.__TAURI_PLUGIN_OS__ || {
  type: () => 'macos',
};

export const forTesting = 'only';
