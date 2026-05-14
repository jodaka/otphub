/**
 * Parse an otpauth:// URI and extract token data
 * @param {string} uri - The otpauth URI
 * @returns {object|null} - Token object or null if invalid
 */
const parseOtpauthUri = (uri) => {
  try {
    const url = new URL(uri);

    if (url.protocol !== 'otpauth:') {
      throw new Error(`Invalid protocol: ${url.protocol}. Expected otpauth://`);
    }

    const type = url.hostname.toUpperCase(); // TOTP or HOTP
    if (type !== 'TOTP') {
      console.warn('Only TOTP is supported, got:', type);
    }

    // Extract label from pathname (remove leading slash)
    let label = decodeURIComponent(url.pathname.substring(1));
    let issuer = url.searchParams.get('issuer') || '';

    // If label contains issuer prefix (e.g., "Issuer:account"), parse it
    if (label.includes(':')) {
      const [parsedIssuer, parsedLabel] = label.split(':', 2);
      if (!issuer) {
        issuer = parsedIssuer;
      }
      label = parsedLabel;
    }

    const secret = url.searchParams.get('secret');
    if (!secret) {
      throw new Error('No secret found in QR code');
    }

    const algorithm = url.searchParams.get('algorithm') || 'SHA1';
    const digits = parseInt(url.searchParams.get('digits'), 10) || 6;
    const period = parseInt(url.searchParams.get('period'), 10) || 30;

    return {
      label: label || 'Unknown Account',
      issuer: issuer || 'Unknown Service',
      algorithm: algorithm.toUpperCase(),
      digits,
      period,
      secret: secret.toUpperCase(),
    };
  } catch (error) {
    throw new Error(`Failed to parse QR code: ${error.message}`);
  }
};

/**
 * Find existing token index by secret
 * @param {Array} tokens - Existing tokens array
 * @param {string} secret - Secret to check
 * @returns {number} - Index of existing token or -1
 */
const findTokenIndex = (tokens, secret) => {
  return tokens.findIndex((token) => token.secret === secret);
};

/**
 * ScannerButton component for mobile QR code scanning
 */
export const ScannerButton = (onTokenAdded, existingTokens, saveTokens) => {
  const processScannedData = async (data) => {
    let token;

    try {
      token = parseOtpauthUri(data);
    } catch (error) {
      alert(error.message);
      return;
    }

    const existingIndex = findTokenIndex(existingTokens, token.secret);
    if (existingIndex !== -1) {
      const existingToken = existingTokens[existingIndex];
      const confirmOverwrite = window.confirm(
        `A token for "${existingToken.label}" (${existingToken.issuer}) already exists. Do you want to overwrite it?`,
      );
      if (!confirmOverwrite) {
        return;
      }
      existingTokens[existingIndex] = token;
    } else {
      existingTokens.push(token);
    }

    saveTokens(existingTokens);

    if (typeof onTokenAdded === 'function') {
      onTokenAdded();
    }
  };

  const handleScan = async () => {
    try {
      const barcodeScanner = window.__TAURI__.barcodeScanner;

      let permission = await window.__TAURI__.barcodeScanner.checkPermissions();
      if (permission === 'prompt') {
        permission = await window.__TAURI__.barcodeScanner.requestPermissions();
      }
      if (permission === 'granted') {
        const scanned = await barcodeScanner.scan({
          windowed: false,
          formats: [barcodeScanner.Format.QRCode],
        });

        if (scanned?.content) {
          await processScannedData(scanned.content);
        }
      } else {
        console.error('Permission denied to use the camera');
      }
    } catch (error) {
      console.error('Scan cancelled or failed:', error);
    }
  };
};
