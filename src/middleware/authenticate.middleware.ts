import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

interface CustomRequest extends Request {
  flash(type: string, message: string): void;
  session: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: CustomRequest, res: Response, next: NextFunction) {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/page/login');
    }
    try {
      if (user.role !== 'admin') {
        req.flash('errors', "Don't have permission to access this page");
        return res.redirect('/page/login');
      }
      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      return res.redirect('/page/login');
    }
  }
}
