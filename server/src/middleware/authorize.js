
import jwt from "jsonwebtoken";

export const authorize = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access token required",
        });
    }

    const accessToken = authorization.slice(7);

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        if (!decoded.sub) {
            throw new Error("Invalid token payload");
        }

        req.user = {
            id: decoded.sub,
        };

        return next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};
