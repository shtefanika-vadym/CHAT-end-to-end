import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { Chat } from 'src/chat/chat.model';
import { UserService } from 'src/users/user.service';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/message.model';
import { CryptoService } from 'src/crypto/crypto.service';
import { SecretsManagerService } from 'src/secrets-manager/secrets-manager.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, UserService, MessageService, CryptoService, SecretsManagerService],
  imports: [TypeOrmModule.forFeature([User, Chat, Message]), forwardRef(() => AuthModule)],
  exports: [ChatService],
})
export class ChatModule {}
