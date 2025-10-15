const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');

// Encrypt file data
function encrypt(buffer) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
}

// Decrypt file data
function decrypt(hash) {
  const iv = Buffer.from(hash.iv, 'hex');
  const encryptedText = Buffer.from(hash.content, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted;
}

module.exports = { encrypt, decrypt };
