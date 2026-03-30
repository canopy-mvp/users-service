import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';
import crypto from 'crypto';

export async function requestPasswordReset(req: FastifyRequest, reply: FastifyReply) {
  const { email } = req.body as { email: string };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return reply.send({ message: 'If that email exists, a reset link was sent' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    await prisma.passwordReset.create({
      data: { userId: user.id, token, expiresAt: new Date(Date.now() + 3600000) },
    });

    // TODO: send email
    return reply.send({ message: 'If that email exists, a reset link was sent' });
  } catch (err) {
    return reply.status(500).send({ error: (err as Error).message, details: (err as Error).stack });
  }
}
