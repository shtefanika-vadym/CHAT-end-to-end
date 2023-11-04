import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessageResponse } from 'src/reponse/message-response';
import { LoginDto } from 'src/auth/dto/login.dto';
import { LoginResponse } from 'src/auth/responses/login-response';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Post('/register')
  register(@Body() userDto: CreateUserDto): Promise<MessageResponse> {
    return this.authService.register(userDto);
  }
}
