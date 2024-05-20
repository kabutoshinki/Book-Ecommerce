import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('client_id'),
      clientSecret: configService.get('client_secret'),
      callbackURL: 'http://localhost:8080/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const user = this.authService.validateUser({
      email: profile.emails[0].value,
      firstName: profile.name.familyName,
      lastName: profile.name.givenName,
      username: profile.name.givenName,
      avatar: profile.photos[0].value,
    });
    return done(null, user);
    // return {
    //     console.log(accessToken)
    //     console.log(refreshToken)
    //     console.console.log((profile));

    // //   const {name,emails,photos} = profile,
    // //   const user = {
    // //     email:emails[0].value,
    // //     firstName: name.givenName,
    // //     lastName: name.familyName,
    // //     picture:photos[0].value,
    // //     accessToken
    // //   }
    // //   done(null,user)
    // };
  }
}
