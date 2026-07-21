import crypto from "crypto"
import argon2 from "argon2";

/**
 * Generates a random 6-digit OTP.
 */
export function generateOTP(length = 6) {
    const min = 10 ** (length - 1);
    const max = (10 ** length) - 1;

    return crypto.randomInt(min, max + 1).toString();
}
/**
 * Hashes an OTP before storing it.
 */
export async function hashOTP(otp) {
    return argon2.hash(otp, {
        type: argon2.argon2id,
    });
}
/**
 * Verifies a plain OTP against its hash.
 */
export async function verifyOTP(plainOtp, hashedOtp) {
    return argon2.verify(hashedOtp, plainOtp);
}