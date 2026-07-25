import { authService } from "./auth.service.js";
import { validate } from "../../middlewares/validation.middleware.js";

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.validated);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
export async function verifyEmail(req, res, next) {
  try {
    const result = await authService.verifyEmail(req.validated.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
export async function login(req, res, next) {
  try {
    const result = await authService.login(req.validated);

    res.cookie("sid", result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    delete result.sessionId;
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
export async function logout(req, res, next) {
    try {
        const result = await authService.logout(req.session.id);

        res.clearCookie("sid", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
