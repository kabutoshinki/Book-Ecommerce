import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

interface PayloadJwt {
  userId: string;
  image: string;
  role: string;
  email: string;
  iat: number;
  exp: number;
}

interface CustomRequest extends Request {
  flash(type: string, message: string): void;
  session: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: CustomRequest, res: Response, next: NextFunction) {
    //store cookie
    // const token =
    //   (req.cookies && req.cookies['token']) ||
    //   (req.headers && req.headers['authorization']?.split(' ')[1]);
    const token = req.session.token;
    if (!token) {
      return res.redirect('/page/login');
    }

    try {
      const secret = this.configService.get<string>('secret');
      const decoded = jwt.verify(token, secret) as PayloadJwt;
      if (decoded.exp < Date.now() / 1000) {
        req.flash('errors', 'Time login is expired');
        return res.redirect('/page/login');
      }
      if (decoded.role !== 'admin') {
        req.flash('errors', "Don't have permission to access this page");
        return res.redirect('/page/login');
      }
      req.user = decoded;
      next();
    } catch (err) {
      console.error(err);
      return res.redirect('/page/login');
    }
  }
}
