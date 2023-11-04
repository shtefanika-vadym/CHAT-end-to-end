import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { SecretsManagerService } from 'src/secrets-manager/secrets-manager.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sService: SecretsManagerService,
  ) {}

  @Get('/health')
  async getHealthCheck() {
    return this.appService.getHealthCheck();
  }
}
