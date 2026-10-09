import {
    signupService,
    loginService,
    getCurrentUserService,
} from "./user.Service.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
};

const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};

export const signupController = async (req, res) => {
    try {
        const { user, token } = await signupService(req.body);

        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user,
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create account",
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { user, token } = await loginService(req.body);

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

export const meController = async (req, res) => {
    try {
        const user = await getCurrentUserService(req.user.id);

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        if (error.statusCode === 401) {
            res.clearCookie("token", clearCookieOptions);

            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Get account error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch account",
        });
    }
};

export const logoutController = (req, res) => {
    res.clearCookie("token", clearCookieOptions);

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};