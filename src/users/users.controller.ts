import { Controller, Get } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/users.model';

@Controller('users')
export class UsersController {
  constructor(private usersService: UserService) {}

  @Get('/users')
  async getAllUsers(): Promise<User[]> {
    return [];
  }
}
