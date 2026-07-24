import crypto from "crypto";
import redis from "../../../config/redis.js";

const SESSION_PREFIX = "session:";
const SESSION_TTL = 60 * 60 * 24 * 7;

export async function createSession(userId) {
  const sessionId = crypto.randomUUID();

  const key = SESSION_PREFIX + sessionId;

  await redis.set(
    key,
    JSON.stringify({
      userId,
    }),
    {
      EX: SESSION_TTL,
    }
  );

  return sessionId;
}

export async function getSession(sessionId) {
  const session = await redis.get(
    SESSION_PREFIX + sessionId
  );

  if (!session) {
    return null;
  }

  return JSON.parse(session);
}

export async function deleteSession(sessionId) {
  await redis.del(
    SESSION_PREFIX + sessionId
  );
}

export async function refreshSession(sessionId) {
  await redis.expire(
    SESSION_PREFIX + sessionId,
    SESSION_TTL
  );
}