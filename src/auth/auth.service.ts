import { PayloadType } from './types';
import { AuthPayloadDto } from './dto/requests/auth.dto';
import { UsersService } from './../users/users.service';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/requests/refresh-token.dto';
import { UserValidateDto } from './dto/requests/user-validate.dto';
import { LoginResponseDto } from './dto/responses/login-response.dto';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private cartService: CartService,
  ) {}

  async login(authPayload: AuthPayloadDto) {
    try {
      const user = await this.userService.findOne(authPayload);

      if (!user) {
        throw new NotFoundException('Email not exist');
      }
      if (!user.isActive) {
        throw new NotAcceptableException('Email cannot login');
      }
      const passwordMatched = await bcrypt.compare(
        authPayload.password,
        user.password,
      );

      if (!passwordMatched) {
        throw new UnauthorizedException('Password does not match');
      }
      const guestCartKey = `cart:guest`;
      const userCartKey = `cart:${user.id}`;
      await this.cartService.mergeCarts(guestCartKey, userCartKey);

      return this.generateLoginResponse(user);
    } catch (error) {
      console.log(error);
    }
  }

  async loginServerSide(authPayload: AuthPayloadDto) {
    try {
      const user = await this.userService.findOne(authPayload);

      if (!user) {
        throw new NotFoundException('Email not exist');
      }
      if (!user.isActive) {
        throw new NotAcceptableException('Email cannot login');
      }
      const passwordMatched = await bcrypt.compare(
        authPayload.password,
        user.password,
      );

      if (!passwordMatched) {
        throw new UnauthorizedException('Password does not match');
      }
      const token = this.jwtService.sign({
        userId: user.id,
        image: user.avatar,
        role: user.roles,
        email: user.email,
      });
      const redirectUrl = '/';
      return { token, redirectUrl };
    } catch (error) {
      console.log(error);
    }
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
      avatar: user.avatar,
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
    const user = await this.userService.findOne(details);

    if (!user) {
      await this.userService.createByEmail(details);
    }

    return this.generateLoginResponse(user);
  }
}
