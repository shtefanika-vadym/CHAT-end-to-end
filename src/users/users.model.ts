import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Chat } from 'src/chat/chat.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  publicKey: string;

  @ManyToMany(() => Chat, (chat: Chat) => chat.users)
  chats: Chat[];
}
