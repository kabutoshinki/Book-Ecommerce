import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/request/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guard/role.guard';
import { RefreshTokenDto } from './dto/request/refresh-token.dto';
import { GoogleAuthGuard } from 'src/guard/google.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get profile user' })
  @ApiResponse({
    status: 200,
    description: 'It will return user profile',
  })
  getProfile(@Request() req) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @Post('login')
  async login(@Body() authPayload: AuthPayloadDto) {
    return this.authService.login(authPayload);
  }

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get('google-login')
  @UseGuards(AuthGuard('google'))
  async loginGoogle() {
    console.log('login-google');
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect() {
    return console.log('redirect-google');
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshDto);
  }

  @Post('forgot-password')
  async forgotPassword() {
    console.log('forgot-password');
  }
}
