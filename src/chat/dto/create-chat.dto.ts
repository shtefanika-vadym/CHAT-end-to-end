import { IsNumber } from 'class-validator';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';

export class CreateChatDto extends CreateMessageDto {
  @IsNumber(undefined, { message: 'Receiver ID must be a number' })
  readonly receiverId: number;
}
