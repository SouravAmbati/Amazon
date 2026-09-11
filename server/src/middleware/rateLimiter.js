import rateLimit from "express-rate-limit";
export const productRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 1,           // 10 requests per minute
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});