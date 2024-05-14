import { PayloadType } from './types';
import { AuthPayloadDto } from './dto/request/auth.dto';
import { UsersService } from './../users/users.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/request/refresh-token.dto';
import { UserValidateDto } from './dto/request/user-validate.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authPayload: AuthPayloadDto) {
    const user = await this.userService.findOne(authPayload);
    if (!user) {
      throw new NotFoundException('Email not exist');
    }
    const passwordMatched = await bcrypt.compare(
      authPayload.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Password does not match');
    }

    return this.generateLoginResponse(user);
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const decodeToken = this.jwtService.verify(refreshToken, {
        ignoreExpiration: true,
      });
      const user = await this.userService.findById(decodeToken.sub);

      return this.generateLoginResponse(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  private async generateLoginResponse(user): Promise<LoginResponseDto> {
    const payload: PayloadType = {
      email: user.email,
      username: user.username,
      sub: user.id,
      role: user.roles,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      }),
    };
  }
  async validateUser(details: UserValidateDto) {
    let user = await this.userService.findOne(details);

    if (!user) {
      user = await this.userService.createByEmail(details);
    }

    return this.generateLoginResponse(user);
  }
}
