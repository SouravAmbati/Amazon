import { VerificationChallengeType } from "@prisma/client";
import { prisma } from "../../../config/Prisma.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { hashOTP, verifyOTP } from "./otp.service.js";

export async function createChallenge({
  prisma: db,
  userId,
  type = VerificationChallengeType.EMAIL_VERIFICATION,
  otp,
  expiresInMinutes = 10,
  maxAttempts = 5,
}) {
  const hashedCode = await hashOTP(otp);

  const expiresAt = new Date(
    Date.now() + expiresInMinutes * 60 * 1000
  );

  return db.verificationChallenge.create({
    data: {
      userId,
      type,
      hashedCode,
      expiresAt,
      maxAttempts,
      // attemptCount defaults to 0 in Prisma
    },
  });
}

export async function getActiveChallenge({
  userId,
  type = VerificationChallengeType.EMAIL_VERIFICATION,
}) {
  return prisma.verificationChallenge.findFirst({
    where: {
      userId,
      type,
      consumedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function consumeChallenge(id) {
  return prisma.verificationChallenge.update({
    where: {
      id,
    },
    data: {
      consumedAt: new Date(),
    },
  });
}

export async function incrementAttempts(id, currentAttempts) {
  return prisma.verificationChallenge.update({
    where: {
      id,
    },
    data: {
      attemptCount: currentAttempts + 1,
    },
  });
}

export async function invalidateChallenges({
  userId,
  type = VerificationChallengeType.EMAIL_VERIFICATION,
}) {
  return prisma.verificationChallenge.updateMany({
    where: {
      userId,
      type,
      consumedAt: null,
    },
    data: {
      consumedAt: new Date(),
    },
  });
}

export async function verifyChallenge({
  userId,
  type = VerificationChallengeType.EMAIL_VERIFICATION,
  otp,
}) {
  const challenge = await getActiveChallenge({
    userId,
    type,
  });

  if (!challenge) {
    throw new BadRequestError(
      "No active verification challenge found."
    );
  }

  if (challenge.expiresAt < new Date()) {
    throw new BadRequestError(
      "Verification code has expired."
    );
  }

  if (challenge.attemptCount >= challenge.maxAttempts) {
    throw new BadRequestError(
      "Maximum verification attempts exceeded."
    );
  }

  const isValid = await verifyOTP(
    otp,
    challenge.hashedCode
  );

  if (!isValid) {
    await incrementAttempts(
      challenge.id,
      challenge.attemptCount
    );

    throw new BadRequestError(
      "Invalid verification code."
    );
  }

  // Don't consume here.
  // Let auth.service.js do it inside a transaction.

  return challenge;
}