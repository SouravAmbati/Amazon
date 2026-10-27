
import {
    signupService,
    loginService,
    refreshSessionService,
    logoutService,
    getCurrentUserService,
} from "./user.Service.js";

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:
        Number(process.env.REFRESH_TOKEN_DAYS || 7) *
        24 * 60 * 60 * 1000,
    path: "/api/user/v1",
};

const clearRefreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/user/v1",
};

const sendAuthResponse = (
    res,
    statusCode,
    message,
    result
) => {
    res.cookie(
        "refreshToken",
        result.refreshToken,
        refreshCookieOptions
    );

    return res.status(statusCode).json({
        success: true,
        message,
        user: result.user,
        accessToken: result.accessToken,
    });
};

export const signupController = async (req, res) => {
    try {
        const result = await signupService(req.body);

        return sendAuthResponse(
            res,
            201,
            "Account created successfully",
            result
        );
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
        const result = await loginService(req.body);

        return sendAuthResponse(
            res,
            200,
            "Login successful",
            result
        );
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

export const refreshController = async (req, res) => {
    try {
        const result = await refreshSessionService(
            req.cookies?.refreshToken
        );

        res.cookie(
            "refreshToken",
            result.refreshToken,
            refreshCookieOptions
        );

        return res.status(200).json({
            success: true,
            accessToken: result.accessToken,
        });
    } catch (error) {
        res.clearCookie(
            "refreshToken",
            clearRefreshCookieOptions
        );

        if (error.statusCode === 401) {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
        }

        console.error("Refresh error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not refresh session",
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

export const logoutController = async (req, res) => {
    try {
        await logoutService(req.cookies?.refreshToken);

        res.clearCookie(
            "refreshToken",
            clearRefreshCookieOptions
        );

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};
