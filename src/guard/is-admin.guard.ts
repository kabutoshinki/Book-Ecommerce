import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Session } from 'express-session';

interface CustomRequest extends Request {
  session: Session & { user?: { role: string } };
}

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<CustomRequest>();
    const user = req.session.user;

    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException(
        "You don't have permission to access this resource",
      );
    }

    return true;
  }
}
