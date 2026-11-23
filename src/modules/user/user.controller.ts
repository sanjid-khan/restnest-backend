import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpstatus from "http-status";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const profile = await userService.getMyProfileFromDB(req.user?.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "User profile fetched successfully",
        data: { profile }
    });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedProfile = await userService.updateMyProfileInDB(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "User profile updated successfully",
        data: { updatedProfile }
    });
});

// ================= Saron-Contribution Start =================
// কাজ: লগইন করা ইউজারের নিজের প্রোফাইল ডিলিট করার জন্য নতুন কন্ট্রোলার ফাংশন যুক্ত করা হয়েছে
const deleteMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const deletedProfile = await userService.deleteMyProfileFromDB(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "User profile deleted successfully",
        data: { deletedProfile }
    });
});
// ================= Saron-Contribution End ===================

export const userController = {
    getMyProfile,
    updateMyProfile,
    // === Saron-Contribution: ডিলিট ফাংশনটি এক্সপোর্ট করা হলো ===
    deleteMyProfile
};