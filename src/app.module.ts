import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { Chat } from 'src/chat/chat.model';
import { Message } from 'src/message/message.model';
import { MessageModule } from 'src/message/message.module';
import { CryptoService } from 'src/crypto/crypto.service';
import { SecretsManagerService } from 'src/secrets-manager/secrets-manager.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      synchronize: true,
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRESS_PORT,
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      entities: [User, Chat, Message],
    }),
    UsersModule,
    AuthModule,
    ChatModule,
    ChatModule,
    MessageModule,
  ],
  providers: [AppService, CryptoService, SecretsManagerService],
  controllers: [AppController],
})
export class AppModule {}
