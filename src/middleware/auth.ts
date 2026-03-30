import { FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify';
import { authService } from '../services/auth.service';
import { logger } from '../lib/logger';

export const authMiddleware: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (req: FastifyRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Missing authorization header' } });
    }

    const token = authHeader.slice(7);
    const decoded = await authService.verifyToken(token);

    if (!decoded) {
      return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
    }

    req.user = decoded;
    logger.info({ userId: decoded.userId, path: req.url }, 'Request authenticated');
  });
};
