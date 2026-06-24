// ───────────────────────────────────────────────────────────
// PromptPay (Thailand) EMVCo QR payload generator — no deps.
// Produces the string you feed into a QR renderer (qrcode.react).
// Supports mobile numbers and 13-digit National/Tax IDs.
// ───────────────────────────────────────────────────────────

function formatTarget(id: string): string {
  const sanitized = id.replace(/[^0-9]/g, '');
  // 13-digit National ID / Tax ID
  if (sanitized.length >= 13) return sanitized.slice(0, 13);
  // Mobile number -> 0066 + last 9 digits
  const phone = sanitized.replace(/^0/, '66');
  return ('0000000000000' + phone).slice(-13);
}

function f(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Build a PromptPay QR payload.
 * @param id   Merchant mobile number (e.g. "0812345678") or 13-digit ID.
 * @param amount Optional THB amount. Omit for an "any amount" QR.
 */
export function buildPromptPayPayload(id: string, amount?: number): string {
  const target = formatTarget(id);
  const isPhone = target.length === 13 && target.startsWith('0066') === false && id.replace(/\D/g, '').length <= 11;

  // AID for PromptPay
  const merchantAccount = f(
    '29',
    f('00', 'A000000677010111') + f(isPhone ? '01' : '02', target),
  );

  let payload =
    f('00', '01') + // payload format indicator
    f('01', amount != null ? '12' : '11') + // 11 = static, 12 = dynamic
    merchantAccount +
    f('53', '764') + // currency THB
    (amount != null ? f('54', amount.toFixed(2)) : '') +
    f('58', 'TH'); // country

  payload += '6304'; // CRC tag + length
  return payload + crc16(payload);
}
