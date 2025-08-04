import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 32;

const deriveKey = (secret: string, salt: Buffer): Buffer => {
  return scryptSync(secret, salt, 32);
};

export const encrypt = (text: string): string => {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(process.env.ENCRYPTION_SECRET!, salt);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();

  return [
    salt.toString("hex"),
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted,
  ].join(":");
};

export const decrypt = (encryptedText: string): string => {
  if (!encryptedText) throw new Error("Empty encrypted text");

  const parts = encryptedText.split(":");
  if (parts.length !== 4) {
    console.error("Invalid encrypted format. Received:", encryptedText);
    throw new Error("Invalid encrypted format");
  }

  const [saltHex, ivHex, tagHex, cipherText] = parts;

  try {
    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const key = deriveKey(process.env.ENCRYPTION_SECRET!, salt);

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(cipherText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
};
