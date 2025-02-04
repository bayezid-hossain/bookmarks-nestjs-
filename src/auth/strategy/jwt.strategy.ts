import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../../src/prisma/prisma.service";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET") || "secret"
        })
    }
    // async validate(payload: User) {
    //     return { userId: payload.id, email: payload.email };
    // }
    async validate(payload: { sub: number, email: string }) {

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }, omit: {
                hash: true
            }
        })
        return user
    }
}