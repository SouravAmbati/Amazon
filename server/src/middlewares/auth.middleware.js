import { prisma } from "../config/Prisma.js";
import { getSession } from "../modules/auth/services/session.service.js";
import { AUTH_USER_SELECT } from "../shared/constants/userSelect.js";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError.js";


export async function requireAuth(req, res, next) {
  try {
    const sessionId = req.cookies.sid;

    if (!sessionId) {
      throw new UnauthorizedError("Authentication required.");
    }

    const session = await getSession(sessionId);

    if (!session) {
      throw new UnauthorizedError("Session expired.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: AUTH_USER_SELECT,
    });

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
