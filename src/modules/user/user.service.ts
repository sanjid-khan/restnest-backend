import {prisma} from "../../lib/prisma";
import { UpdateProfilePayload } from "./user.interface";


const getMyProfileFromDB = async (userId:string)=>{

    const user = await prisma.user.findUniqueOrThrow({
        where : {id : userId},
        omit : {
            password : true
        },
        include : {
            profile : true
        }
    });

    return user;

}


const updateMyProfileInDB = async (userId : string, payload:UpdateProfilePayload)=>{

    const {name, email, profilePhoto, bio}=payload;

    if (email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: userId,
        },
      },
    });


    if(existingUser) {
      throw new Error("User with this email already exists");
      }
     }

    const updatedUser = await prisma.user.update({
        where : { id : userId},

        data : {
            name,
            email,
            profile:{
        upsert:{
           update:{
            profilePhoto,
            bio
          },
         create:{
            profilePhoto,
            bio
           }
          }
         }

        },

        omit : {
            password : true
        },

        include : {
            profile : true
        }
    })

    return updatedUser;
}



export const userService = {
    getMyProfileFromDB,
    updateMyProfileInDB
}