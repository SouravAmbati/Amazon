import { prisma } from "../../config/Prisma.js";
import { AUTH_USER_SELECT } from "../../shared/constants/userSelect.js";
import { BadRequestError } from "../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../shared/errors/ConflictError.js";
import { sendVerificationEmail } from "./services/email.service.js";
import { generateOTP } from "./services/otp.service.js";
import { hashPassword, verifyPassword } from "./services/password.service.js";
import { createSession, deleteSession } from "./services/session.service.js";

import {
  createChallenge,
  verifyChallenge,
} from "./services/verification.service.js";

async function register(data) {
  const email = data.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await hashPassword(data.password);
  const otp = generateOTP();

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email,
      },
    });

    await tx.authCredential.create({
      data: {
        userId: user.id,
        passwordHash,
      },
    });
    await createChallenge({
      prisma: tx,
      userId: user.id,
      otp,
    });
  });
  await sendVerificationEmail({
    email,
    firstName: data.firstName,
    otp,
  });

  return {
    success: true,
    message: "Registration successful. Please verify your email.",
  };
}
async function verifyEmail(data) {
  const email = data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new BadRequestError(
      "INVALID_VERIFICATION_REQUEST"
    );
  }

  if (user.emailVerifiedAt) {
    throw new BadRequestError(
      "EMAIL_ALREADY_VERIFIED"
    );
  }

  const challenge = await verifyChallenge({
    userId: user.id,
    otp: data.otp,
  });

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerifiedAt: new Date(),
      },
    });

    await tx.verificationChallenge.update({
      where: {
        id: challenge.id,
      },
      data: {
        consumedAt: new Date(),
      },
    });
  });

  return {
    success: true,
    message: "Email verified successfully.",
  };
}
async function login(data) {

    const email = data.email
        .trim()
        .toLowerCase();

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        include: {
            credential: true,
        },
    });

    if (!user) {
        throw new BadRequestError(
            "INVALID_EMAIL_OR_PASSWORD"
        );
    }

    if (!user.emailVerifiedAt) {
        throw new BadRequestError(
            "EMAIL_NOT_VERIFIED"
        );
    }

    if (user.status !== "ACTIVE") {
        throw new BadRequestError(
            "ACCOUNT_DISABLED"
        );
    }

    const validPassword =
        await verifyPassword(
            data.password,
            user.credential.passwordHash
        );

    if (!validPassword) {
        throw new BadRequestError(
            "INVALID_EMAIL_OR_PASSWORD"
        );
    }
    const sessionId = await createSession(user.id);
    return {
        success: true,
        message: "Login successful.",
        sessionId,
    };

}

export async function logout(sessionId) {
    await deleteSession(sessionId);

    return {
        success: true,
        message: "Logout successful.",
    };
}
async function me(userId) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select:AUTH_USER_SELECT
    });

    if (!user) {
        throw new NotFoundError("User not found.");
    }

    return {
        success: true,
        data: user,
    };
}

export const authService = {
  register,
  verifyEmail,
  login,
  logout,
  me
};
