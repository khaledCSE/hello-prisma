import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { SignInDto, SignupDto } from './dto/auth.dto';
import { TOKENS } from './types/token.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(
    userId: string,
    email: string,
    fullName: string,
  ): Promise<TOKENS> {
    const [at, rt] = await Promise.all([
      await this.jwtService.signAsync(
        { userId, email, fullName },
        { expiresIn: 15 * 60, secret: 'at-secret' },
      ),
      await this.jwtService.signAsync(
        { userId, email, fullName },
        { expiresIn: 60 * 60 * 7, secret: 'at-secret' },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signupLocal(signupDto: SignupDto): Promise<TOKENS> {
    const newUser = await this.databaseService.user.create({
      data: {
        email: signupDto.email,
        password: await this.hashData(signupDto.password),
        fullName: signupDto.fullName,
      },
    });
    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.fullName,
    );

    await this.updateHashedRt(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async updateHashedRt(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);

    await this.databaseService.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }

  async signInLocal(dto: SignInDto): Promise<TOKENS> {
    const user = await this.databaseService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ForbiddenException('Access Denied!');
    }

    const passwordsMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordsMatch) {
      throw new ForbiddenException('Access Denied!');
    }

    const tokens = await this.getTokens(user.id, user.email, user.fullName);

    await this.updateHashedRt(user.id, tokens.refresh_token);
    return tokens;
  }

  logout() {}

  refreshToken() {}
}
