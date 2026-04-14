const DEBUG_TOKENS = [
  {
    label: "test acc1",
    issuer: "akudris@ruform",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: "A3QNWHBGVD",
  },
  {
    label: "test acc2",
    issuer: "akudris",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: "MZIUO5DHGA",
  },
];

export const getStoredTokens = () => {
  return new Promise((resolve) => {
    const raw = window.localStorage.getItem("tokens");
    try {
      if (!raw) {
        resolve(DEBUG_TOKENS);
      } else {
        const parsed = JSON.parse(raw);
        resolve(parsed);
      }
    } catch (_err) {
      resolve(DEBUG_TOKENS);
    }
  });
};

/** @param {object} tokens json */
export const saveTokens = (tokens) => {
  return window.localStorage.setItem("tokens", JSON.stringify(tokens));
};
