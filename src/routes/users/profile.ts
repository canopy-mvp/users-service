import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';

export async function getUserProfile(req: FastifyRequest, reply: FastifyReply) {
  const { userId } = req.params as any;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  if (!user) {
    return reply.status(404).send({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
  }

  return reply.send(user);
}
