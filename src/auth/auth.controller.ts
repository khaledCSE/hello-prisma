import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TOKENS } from './types/token.type';
import { SignInDto, SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  async signupLocal(@Body() dto: SignupDto): Promise<TOKENS> {
    return await this.authService.signupLocal(dto);
  }

  @Post('/local/signIn')
  signInLocal(@Body() dto: SignInDto): Promise<TOKENS> {
    return this.authService.signInLocal(dto);
  }

  @Post('/local/logout')
  logout() {
    this.authService.logout();
  }

  @Post('/refresh')
  refreshToken() {
    this.authService.refreshToken();
  }
}
