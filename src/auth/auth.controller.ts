import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { RefreshInput } from './dto/refresh.input';
import { ChangePasswordInput } from 'src/users/dto/change-password.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupInput: SignupInput) {
    return this.authService.createUser(signupInput);
  }

  @Post('login')
  async login(@Body() loginInput: LoginInput) {
    return this.authService.login(loginInput.email, loginInput.password);
  }

  @Post('refresh')
  async refresh(@Body() refreshInput: RefreshInput) {
    return this.authService.refreshToken(refreshInput.refreshToken);
  }
} 
