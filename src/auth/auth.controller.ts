import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/requests/auth.dto';
import { CreateUserDto } from '../users/dto/requests/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guard/role.guard';
import { RefreshTokenDto } from './dto/requests/refresh-token.dto';
import { GoogleAuthGuard } from '../guard/google.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/response/user-response.dto';

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

  @HttpCode(HttpStatus.OK)
  @Post('server/login')
  async loginServerSide(
    @Body() authPayload: AuthPayloadDto,
    @Request() req,
    @Response() res,
  ) {
    const { token, redirectUrl } = await this.authService.loginServerSide(
      authPayload,
    );

    // res.cookie('token', token, { httpOnly: true, secure: true });
    req.session.token = token;
    return res.redirect(redirectUrl);
  }

  @Post('signup')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
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
  @Get('logout')
  async logout(@Response() res, @Request() req) {
    req.session.destroy();
    res.clearCookie('token');
    res.redirect('/page/login');
  }
}
