import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chat/chat.model';
import { Repository } from 'typeorm';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { User } from 'src/users/users.model';
import { UserService } from 'src/users/user.service';
import { MessageResponse } from 'src/reponse/message-response';
import { MessageService } from 'src/message/message.service';
import { CryptoService } from 'src/crypto/crypto.service';
import { SecretsManagerService } from 'src/secrets-manager/secrets-manager.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private userService: UserService,
    private cryptoService: CryptoService,
    private messageService: MessageService,
    private secretsService: SecretsManagerService,
  ) {}

  async createChat(userId, { receiverId, content }: CreateChatDto): Promise<MessageResponse> {
    if (userId === receiverId) throw new BadRequestException('Cannot create chat with yourself');
    const users: User[] = await Promise.all([
      this.userService.getById(userId),
      this.userService.getById(receiverId),
    ]);

    const chat: Chat = new Chat();
    chat.users = users;
    await this.chatRepository.save(chat);
    await this.createMessage(userId, chat.id, content);
    return { message: 'Chat created successfully' };
  }

  async getChatsByUserId(userId: number) {
    const chats: Chat[] = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.users', 'user', 'user.id = :userId', { userId })
      .leftJoinAndSelect('chat.users', 'opponentUser')
      .where('opponentUser.id != :userId', { userId })
      .leftJoinAndSelect('chat.messages', 'message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .getMany();
    return await this.adjustChatList(chats);
  }

  private async adjustChatList(chats: Chat[]) {
    return await Promise.all(
      chats.map((chat: Chat) => {
        return this.getAdjustedChat(chat);
      }),
    );
  }

  private async getAdjustedChat({ users, messages, ...rest }) {
    const [{ id, email, name }] = users;
    const adjustedMessages = await Promise.all(
      messages.map(async ({ id, sender, receiver, content }) => {
        const privateKey: string = await this.secretsService.getSecret(String(receiver.id));
        const decryptedContent = this.cryptoService.decryptMessage(content, privateKey);
        return { id, senderId: sender.id, content: decryptedContent };
      }),
    );
    return {
      ...rest,
      receiverId: id,
      receiverName: name,
      receiverEmail: email,
      messages: adjustedMessages,
    };
  }

  async getById(id: number): Promise<Chat> {
    const chat: Chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found.`);
    }

    return chat;
  }

  async createMessage(userId: number, chatId, content: string) {
    const chat: Chat = await this.getById(chatId);
    const user: User = await this.userService.getById(userId);
    return this.messageService.createMessage(user, chat, content);
  }

  getChatUsers(userId: number) {
    return this.userService.getAllUsers(userId);
  }
}
