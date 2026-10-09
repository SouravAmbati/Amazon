import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";



import { createUser, findUserByEmail, findUserById } from "./user.Repository.js";
import { createToken } from "../../utils/createToken.js";

const normalizeEmail = (email) => email.trim().toLowerCase();

const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const publicUser = (user) => ({
    id: user.id,
    user_name: user.user_name,
    user_email: user.user_email,
});

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

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
        const error = new Error("Email is already registered");
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

    return {
        user,
        token: createToken(user),
    };
};

export const loginService = async ({ email, password }) => {
    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !isValidEmail(email.trim()) ||
        !password
    ) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
    }

    const user = await findUserByEmail(normalizeEmail(email));

    if (
        !user ||
        !(await bcrypt.compare(password, user.user_password))
    ) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    return {
        user: publicUser(user),
        token: createToken(publicUser(user)),
    };
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