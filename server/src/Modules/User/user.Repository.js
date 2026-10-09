import pool from "../../db/connection.js";


export const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT id, user_name, user_email, user_password
         FROM users
         WHERE user_email = $1`,
        [email]
    );

    return result.rows[0] ?? null;
};

export const findUserById = async (id) => {
    const result = await pool.query(
        `SELECT id, user_name, user_email
         FROM users
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] ?? null;
};

export const createUser = async ({
    id,
    username,
    email,
    hashedPassword,
}) => {
    const result = await pool.query(
        `INSERT INTO users (
            id,
            user_name,
            user_email,
            user_password
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_name, user_email`,
        [id, username, email, hashedPassword]
    );

    return result.rows[0];
};