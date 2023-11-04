import * as crypto from 'crypto';

export class CryptoService {
  generateUserKeys(): crypto.KeyPairSyncResult<string, string> {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
  }

  encryptMessage(message: string, key: string): string {
    const publicKey: crypto.KeyObject = crypto.createPublicKey(key);
    const buffer: Buffer = Buffer.from(message);
    const encrypted: Buffer = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
  }

  decryptMessage(message: string, key: string): string {
    const privateKey: crypto.KeyObject = crypto.createPrivateKey(key);
    const buffer: Buffer = Buffer.from(message, 'base64');
    const decrypted: Buffer = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
  }
}
