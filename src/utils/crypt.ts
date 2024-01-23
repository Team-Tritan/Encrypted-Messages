"use strict";

import config from "../../config";
import crypto from "crypto";

let secretKey = config.secretKey.toString();
const algorithm = "aes-256-ctr";

const encryptText = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);

  let encryptedText = cipher.update(text, "utf-8", "hex");

  encryptedText += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedText}`;
};

const decryptText = (encryptedText: string): string => {
  const [ivHex, encryptedTextHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );

  let decryptedText = decipher.update(encryptedTextHex, "hex", "utf-8");

  decryptedText += decipher.final("utf-8");
  return decryptedText;
};

export { encryptText, decryptText };
