import { Injectable } from '@nestjs/common';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { google } from '@google-cloud/secret-manager/build/protos/protos';

@Injectable()
export class SecretsManagerService {
  private client: SecretManagerServiceClient;

  constructor() {
    this.client = new SecretManagerServiceClient({
      keyFilename: './src/secrets-manager/google.json',
    });
  }

  async createSecret(key: string, value: string): Promise<ReturnType<any>> {
    try {
      const request: google.cloud.secretmanager.v1.ICreateSecretRequest = {
        parent: 'projects/crypto-plane-402615',
        secretId: key,
        secret: {
          replication: {
            automatic: {},
          },
        },
      };

      await this.client.createSecret(request);

      const versionRequest = {
        parent: `projects/crypto-plane-402615/secrets/${key}`,
        payload: {
          data: Buffer.from(value, 'utf8'),
        },
      };

      return this.client.addSecretVersion(versionRequest);
    } catch (err) {
      await this.deleteSecret(key);
      return this.createSecret(key, value);
    }
  }

  async getSecret(key: string): Promise<string> {
    const name = `projects/crypto-plane-402615/secrets/${key}/versions/1`;
    const [version] = await this.client.accessSecretVersion({ name });
    return version.payload.data.toString();
  }

  async deleteSecret(key: string): Promise<any> {
    const name = `projects/crypto-plane-402615/secrets/${key}`;
    return this.client.deleteSecret({ name });
  }
}
