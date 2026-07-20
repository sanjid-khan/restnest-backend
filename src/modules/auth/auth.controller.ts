import {NextFunction, Request,RequestHandler,Response } from "express"
import { catchAsync } from "../../utils/catchAsync";
import httpstatus from "http-status"
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";



const registerUser = catchAsync (async (req:Request, res:Response,next:NextFunction)=>{
         
    const payload = req.body;
       
    const user = await authService.registerUserIntoDB(payload);

     sendResponse(res, {
        success: true,
        statusCode: httpstatus.CREATED,
        message: "User registered successfully",
        data: { user }
    })

})



const loginUser = catchAsync ( async (req:Request, res:Response, next:NextFunction)=>{
         
    const payload = req.body;

    const {accessToken,refreshToken} = await authService.loginUserIntoDB(payload);


    res.cookie("accessToken", accessToken, {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 
     })


    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 * 7 
    })

    
    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "User logged in successfully",
        data: { accessToken, refreshToken}
    });
})




const getUser =  catchAsync ( async (req:Request, res:Response,next:NextFunction)=>{

    
    const userId = req.user?.id as string;

    if (!userId) {
        res.status(httpstatus.UNAUTHORIZED).json({
            success: false,
            message: "You are not authorized to access this profile!",
        });
        return; 
    }

    
    const user = await authService.getUserIntoDB(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "User profile fetched successfully",
        data: user 
    });
})



export const authController = {
    registerUser,
    loginUser,
    getUser
}