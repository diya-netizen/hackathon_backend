import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const data = await this.authService.validateUser(body.email, body.password);
    req.session.userId = data?.user?.id;
    return res.json(data);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: 'Logout failed' });
      res.json({ message: 'Logged out successfully', success: true });
    });
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    if (!req.session.userId) {
      return { message: 'Session not found', success: false };
    }
    const user = await this.authService.getMyUser(req.session.userId);
    if (!user) {
      return { message: 'User not found', success: false };
    }
    const { password, ...safeUser } = user;
    return { user: safeUser, success: true };
  }
}
