import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/message/message.model';
import { Chat } from 'src/chat/chat.model';
import { User } from 'src/users/users.model';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private cryptoService: CryptoService,
  ) {}

  async createMessage(user: User, chat: Chat, content: string) {
    const receiver: User = chat.users.find(({ id }: User) => id !== user.id);

    const message: Message = new Message();
    message.chat = chat;
    message.sender = user;
    message.receiver = receiver;
    message.content = this.cryptoService.encryptMessage(content, receiver.publicKey);
    await this.messageRepository.save(message);
    return { message: 'Message sent successfully' };
  }
}
