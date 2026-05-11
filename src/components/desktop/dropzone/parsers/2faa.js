export const parser2fa = (json) => {
  if (json?.schemaVersion === 4 && json?.appVersionCode && json?.services?.length) {
    return json?.services.map((srv) => {
      return {
        label: srv.name,
        issuer: srv.otp.account || srv.otp.label || '',
        algorithm: srv.otp.algorithm || 'SHA1',
        digits: srv.otp.digits || 6,
        period: srv.otp.period || 30,
        secret: srv.secret,
        tokenType: srv.otp.tokenType || 'TOTP',
      };
    });
  }

  return [];
};
