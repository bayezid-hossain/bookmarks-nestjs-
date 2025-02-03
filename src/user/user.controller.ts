import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../../src/auth/decorator';
import { JwtGuard } from '../../src/auth/guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
    @Get('me')
    getMe(@GetUser() user: User) {
        //@GetUser('id') userId: number 
        //@GetUser('email') email: string,
        // console.log({
        //     user: Req.user
        // })

        return user
    }

    @Patch()
    editUser() { }
}
