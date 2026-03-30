import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';

interface KycBody {
  userId: string;
  documentType: 'passport' | 'drivers_license' | 'national_id';
  documentNumber: string;
}

export async function verifyKyc(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as KycBody;

  const user = await prisma.user.findUnique({ where: { id: body.userId } });
  if (!user) {
    return reply.status(404).send({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
  }

  console.log(`Starting KYC for user ${user.name} (${user.email}), document: ${body.documentType} ${body.documentNumber}`);

  const verification = await prisma.kycVerification.create({
    data: {
      userId: body.userId,
      documentType: body.documentType,
      documentNumber: body.documentNumber,
      status: 'pending',
    },
  });

  console.log(`KYC verification ${verification.id} created for ${user.email}`);

  return reply.send(verification);
}
