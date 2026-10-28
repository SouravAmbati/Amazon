
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";

import {
    createUser,
    findUserByEmail,
    findUserById,
    saveRefreshToken,
    rotateRefreshTokenRepository,
    revokeRefreshTokenRepository,
} from "./user.Repository.js";

import {
    createToken,
    createRefreshToken,
    hashRefreshToken,
} from "../../utils/createToken.js";

const REFRESH_DAYS = Number(
    process.env.REFRESH_TOKEN_DAYS || 7
);

const normalizeEmail = (email) =>
    email.trim().toLowerCase();

const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const publicUser = (user) => ({
    id: user.id,
    user_name: user.user_name,
    user_email: user.user_email,
});

const issueTokenPair = async (user) => {
    const accessToken = createToken(user);
    const refreshToken = createRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(
        Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000
    );

    await saveRefreshToken(
        user.id,
        tokenHash,
        expiresAt
    );

    return { accessToken, refreshToken };
};

export const signupService = async ({
    username,
    email,
    password,
}) => {
    if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !username.trim() ||
        !isValidEmail(email.trim()) ||
        password.length < 8
    ) {
        const error = new Error(
            "Enter a username, valid email and password of at least 8 characters"
        );
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser =
        await findUserByEmail(normalizedEmail);

    if (existingUser) {
        const error = new Error(
            "Email is already registered"
        );
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await createUser({
        id: randomUUID(),
        username: username.trim(),
        email: normalizedEmail,
        hashedPassword,
    });

    const tokens = await issueTokenPair(user);

    return {
        user,
        ...tokens,
    };
};

export const loginService = async ({
    email,
    password,
}) => {
    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !isValidEmail(email.trim()) ||
        !password
    ) {
        const error = new Error(
            "Email and password are required"
        );
        error.statusCode = 400;
        throw error;
    }

    const user = await findUserByEmail(
        normalizeEmail(email)
    );

    if (
        !user ||
        !(await bcrypt.compare(
            password,
            user.user_password
        ))
    ) {
        const error = new Error(
            "Invalid email or password"
        );
        error.statusCode = 401;
        throw error;
    }

    const safeUser = publicUser(user);
    const tokens = await issueTokenPair(safeUser);

    return {
        user: safeUser,
        ...tokens,
    };
};

export const refreshSessionService = async (
    oldRefreshToken
) => {
    if (!oldRefreshToken) {
        const error = new Error("Refresh token missing");
        error.statusCode = 401;
        throw error;
    }

    const newRefreshToken = createRefreshToken();

    const expiresAt = new Date(
        Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000
    );

    const { userId } =
        await rotateRefreshTokenRepository(
            hashRefreshToken(oldRefreshToken),
            hashRefreshToken(newRefreshToken),
            expiresAt
        );

    const user = await findUserById(userId);

    if (!user) {
        const error = new Error("User no longer exists");
        error.statusCode = 401;
        throw error;
    }

    return {
        accessToken: createToken(user),
        refreshToken: newRefreshToken,
    };
};

export const logoutService = async (refreshToken) => {
    if (!refreshToken) return;

    await revokeRefreshTokenRepository(
        hashRefreshToken(refreshToken)
    );
};

export const getCurrentUserService = async (userId) => {
    const user = await findUserById(userId);

    if (!user) {
        const error = new Error("User no longer exists");
        error.statusCode = 401;
        throw error;
    }

    return user;
};
