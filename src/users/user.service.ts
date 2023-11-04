import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUser } from 'src/users/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async getAllUsers(userId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { id: Not(userId) },
      select: ['id', 'name', 'email'],
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }

  async getById(id: number): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not exist');
    }
    return user;
  }

  async createUser(user: CreateUser): Promise<User> {
    const newUser: User = await this.userRepository.save(user);
    return newUser;
  }
}
