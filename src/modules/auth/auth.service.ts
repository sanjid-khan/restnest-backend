import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs"
import config from "../../config";
import { ILoginUser, RegisterUserPayload } from "./auth.interface";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";



const registerUserIntoDB = async( payload : RegisterUserPayload)=>{

    const { name, email, password, role, profilePhoto } = payload;

    const isUserExist = await prisma.user.findUnique({
        where:{email}
    })

    if(isUserExist){
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))

    const createdUser = await prisma.user.create({
        data:{
            name,
            email,
            role,
            password:hashedPassword,
            profile:{
                create:{
                    profilePhoto
                }
            }
        }
    });


    const user = await prisma.user.findUnique({
        where:{
            id : createdUser.id,
        },
        omit :{
         password :true
        },
    })

    return user;

}


const loginUserIntoDB = async(payload: ILoginUser)=>{

    const {email,password} = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where : {email}
    })


    if (user.userStatus === UserStatus.BANNED) {
          throw new Error("Your account has been banned.");
         }

    const isPasswordMatched = await bcrypt.compare(password,user.password);

    if(!isPasswordMatched){
        throw new Error("Password is incorrect");
    }


    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }


     const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );


    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );


    return {
        accessToken,
        refreshToken
    };

}


const getUserIntoDB = async(userId:string)=>{
        
    const user = await prisma.user.findUniqueOrThrow({
        where : {id : userId},
        omit : {
            password : true
        },
    });

    return user;

}



export const authService ={
    registerUserIntoDB,
    loginUserIntoDB,
    getUserIntoDB
}