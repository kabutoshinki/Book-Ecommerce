import { IsAdminGuard } from './../guard/is-admin.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { RolesGuard } from '../guard/role.guard';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserStateDto } from './dto/requests/update-state-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  @ApiBearerAuth('JWT-auth')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.usersService.findOne({ id });
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.update(id, updateUserDto, file);
  }

  @UseGuards(IsAdminGuard)
  @Patch('change-state/:id')
  async changeState(
    @Param('id') id: string,
    @Body() updateUserStateDto: UpdateUserStateDto,
  ) {
    return await this.usersService.changeState(id, updateUserStateDto);
  }
  @UseGuards(IsAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
