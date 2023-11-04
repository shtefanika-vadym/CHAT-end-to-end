import { forwardRef, Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Message } from 'src/message/message.model';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, CryptoService],
  imports: [TypeOrmModule.forFeature([Message]), forwardRef(() => AuthModule)],
})
export class MessageModule {}
