import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
@Injectable()
export class AuthService{
    constructor(private prisma:PrismaService){

    }
    async signin(dto:AuthDto){

        //find the user by email
        const user=await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        })

        if (!user) throw new ForbiddenException("Credentials Incorrect");

        
        //compare password
        const pwMatches=await argon.verify(user.hash,dto.password);
        //if password incorrect then throw an exception
        if (!pwMatches) throw new ForbiddenException("Credentials incorrect");

        //send back user
        
        return user;
    }
    async signup(dto:AuthDto){
        //generate the hash for password
        const hash=await argon.hash(dto.password)
        //save the new user to db
        try{
            const user= await this.prisma.user.create({
                data:{
                    email:dto.email,
                    hash
                },
                
            })
            //return the saved user
            
            return user
        }
        catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code=='P2002'){
                    
                    throw new ForbiddenException('Credentials Taken',)
                }
                throw error
            }
        }
    }
}