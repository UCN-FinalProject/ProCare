import crypto from "crypto";
import { env } from "~/env.mjs";

// TODO: add to env
const SECRET_KEY =
  "fa3c8e77b56d9a2c4e5f74cfc8ab45d4e9f2c4e79a6d1389b95f75f9126c7f0d";
const IV = "8f2e5a7b49c63d01e48294a6f37bd9e8";

// Function to encrypt text using AES
export function encryptText(text: string) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "hex"),
    Buffer.from(IV, "hex"),
  );
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Function to decrypt AES-encrypted text
export function decryptText(encryptedText: string) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "hex"),
    Buffer.from(IV, "hex"),
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
