import { IsString, Length } from 'class-validator';

export class CreateMessageDto {
  @IsString({ message: 'Content must be a string' })
  @Length(1, 255, { message: 'Content must be between 1 and 255 characters' })
  readonly content: string;
}
