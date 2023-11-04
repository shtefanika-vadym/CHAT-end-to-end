import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat } from 'src/chat/chat.model';
import { User } from 'src/users/users.model';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @ManyToOne(() => User, (user) => user.id)
  sender: User;

  @ManyToOne(() => User, (user) => user.id)
  receiver: User;
}
