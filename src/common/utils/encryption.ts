import * as crypto from 'crypto';

export const encrypt = (data: string) => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    process.env.ENCRYPTIONKEY,
    process.env.ENCRYPTIONIV,
  );
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');

  return encryptedData;
};

export const decrypt = (data: string) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    process.env.ENCRYPTIONKEY,
    process.env.ENCRYPTIONIV,
  );
  let decryptedData = decipher.update(data, 'hex', 'utf-8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};
