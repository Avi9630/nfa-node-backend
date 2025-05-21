const crypto = require("crypto");

/**
 * Decrypt a string produced by Laravel’s Crypt::encryptString()
 * @param {string} payload The `value` or `body` field you got from Laravel
 * @param {string} appKey The APP_KEY from .env (including the “base64:” prefix)
 * @returns {string} plain‑text
 */
function decryptLaravel(payload, appKey) {
  // ----- 1. Prep key & payload -----
  const key = Buffer.from(appKey.replace(/^base64:/, ""), "base64");
  const { iv, value, mac } = JSON.parse(
    Buffer.from(payload, "base64").toString("utf8")
  );

  const ivBuf = Buffer.from(iv, "base64");
  const cipherBuf = Buffer.from(value, "base64");

  // ----- 2. Verify MAC (integrity) -----
  const calcMac = crypto
    .createHmac("sha256", key)
    .update(Buffer.concat([ivBuf, cipherBuf]))
    .digest("hex");

  if (calcMac !== mac) {
    throw new Error(
      "MAC mismatch – the data was tampered with or the key is wrong"
    );
  }

  // ----- 3. Decrypt -----
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuf);
  let decrypted = decipher.update(cipherBuf, undefined, "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = decryptLaravel;
