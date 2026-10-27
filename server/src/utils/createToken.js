
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

export const createToken = (user) => {
    return jwt.sign(
        {
            sub: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15m",
        }
    );
};

export const createRefreshToken = () => {
    return crypto.randomBytes(64).toString("base64url");
};

export const hashRefreshToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};
