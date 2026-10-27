
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

export const saveRefreshToken = async (
    userId,
    tokenHash,
    expiresAt
) => {
    await pool.query(
        `INSERT INTO refresh_tokens (
            user_id,
            token_hash,
            expires_at
        )
        VALUES ($1, $2, $3)`,
        [userId, tokenHash, expiresAt]
    );
};

export const rotateRefreshTokenRepository = async (
    oldTokenHash,
    newTokenHash,
    expiresAt
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            `SELECT rt.id, rt.user_id
             FROM refresh_tokens rt
             WHERE rt.token_hash = $1
               AND rt.revoked_at IS NULL
               AND rt.expires_at > NOW()
             FOR UPDATE`,
            [oldTokenHash]
        );

        if (result.rowCount === 0) {
            const error = new Error(
                "Invalid or expired refresh token"
            );
            error.statusCode = 401;
            throw error;
        }

        const { id, user_id: userId } = result.rows[0];

        const revoked = await client.query(
            `UPDATE refresh_tokens
             SET revoked_at = NOW()
             WHERE id = $1
               AND revoked_at IS NULL`,
            [id]
        );

        if (revoked.rowCount !== 1) {
            const error = new Error(
                "Refresh token has already been used"
            );
            error.statusCode = 401;
            throw error;
        }

        await client.query(
            `INSERT INTO refresh_tokens (
                user_id,
                token_hash,
                expires_at
            )
            VALUES ($1, $2, $3)`,
            [userId, newTokenHash, expiresAt]
        );

        await client.query("COMMIT");

        return { userId };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const revokeRefreshTokenRepository = async (
    tokenHash
) => {
    await pool.query(
        `UPDATE refresh_tokens
         SET revoked_at = NOW()
         WHERE token_hash = $1
           AND revoked_at IS NULL`,
        [tokenHash]
    );
};
