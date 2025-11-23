import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RegisterSwagger, LoginSwagger, LogoutSwagger } from './swagger/auth.swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('register')
   @RegisterSwagger()
   register(@Body() registerDto: RegisterDto) {
      return this.authService.register(registerDto);
   }

   @HttpCode(HttpStatus.OK)
   @Post('login')
   @LoginSwagger()
   login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
   }

   @HttpCode(HttpStatus.OK)
   @UseGuards(JwtAuthGuard)
   @Post('logout')
   @ApiBearerAuth()
   @LogoutSwagger()
   logout() {
      return this.authService.logout();
   }
}
