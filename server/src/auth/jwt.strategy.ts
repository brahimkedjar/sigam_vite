import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
  (req) => {
    // Check cookies first, then authorization header
    let token = req?.cookies?.token;
    
    // If no cookie, check headers
    if (!token && req.headers?.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }
    
    return token;
  }
]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true // Enable request access
    });
  }

  async validate(req: Request, payload: any) {
    // Verify all required fields
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
      permissions: payload.permissions || []
    };
  }
}