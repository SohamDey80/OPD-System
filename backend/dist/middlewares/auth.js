import { User } from "../models/userSchema.js";
import { ErrorHandler } from "./error.js";
import { TryCatch } from "./tryCatch.js";
import jwt from "jsonwebtoken";
export const isAdminAuth = TryCatch(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new ErrorHandler("Unauthorized Admin!", 401));
    }
    const jwtSecret = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "Admin") {
        return next(new ErrorHandler(`${user ? user.role : "User"} not authorized for this resource!`, 401));
    }
    req.user = {
        ...user.toJSON(),
        _id: user._id.toString(),
    };
    next();
});
export const isPatientAuth = TryCatch(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return next(new ErrorHandler("Unauthorized Patient!", 401));
    }
    const jwtSecret = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "Patient") {
        return next(new ErrorHandler(`${user ? user.role : "User"} not authorized for this resource!`, 401));
    }
    req.user = {
        ...user.toJSON(),
        _id: user._id.toString(),
    };
    next();
});
