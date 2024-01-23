import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TOKENS } from './types/token.type';
import { SignInDto, SignupDto } from './dto/auth.dto';
import { Request } from 'express';
import { AtGuard, RtGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(@Body() dto: SignupDto): Promise<TOKENS> {
    return await this.authService.signupLocal(dto);
  }

  @Post('/local/signIn')
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() dto: SignInDto): Promise<TOKENS> {
    return this.authService.signInLocal(dto);
  }

  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user;
    return this.authService.logout(user['userId']);
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshToken(user['userId'], user['refreshToken']);
  }
}
