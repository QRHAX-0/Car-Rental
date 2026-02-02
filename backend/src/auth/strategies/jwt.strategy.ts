import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PayloadDto } from '../dtos/payload.dto';
import { Request } from 'express';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req && req.cookies) {
            return req?.cookies?.access_token as string;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESSSECRET || 'your-secret-key',
    });
  }

  validate(payload: PayloadDto) {
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      agentId: payload.agentId,
    };
  }
}
