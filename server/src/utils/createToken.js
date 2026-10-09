
import jwt from "jsonwebtoken";

export const createToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.user_email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};
