import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserId } from 'src/auth/user-id.decorator';
import { MessageResponse } from 'src/reponse/message-response';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(
    @UserId() userId: number,
    @Body() chat: CreateChatDto,
  ): Promise<MessageResponse> {
    return this.chatService.createChat(userId, chat);
  }

  @Get('/users')
  async getChatUsers(@UserId() userId: number) {
    return this.chatService.getChatUsers(userId);
  }

  @Get()
  async getUserChats(@UserId() userId: number) {
    return this.chatService.getChatsByUserId(userId);
  }

  @Post('/:id/messages')
  async createMessage(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() { content }: CreateMessageDto,
  ) {
    return this.chatService.createMessage(userId, id, content);
  }
}
