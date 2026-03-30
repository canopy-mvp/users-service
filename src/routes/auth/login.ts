import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginBody {
  email: string;
  password: string;
}

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = req.body as LoginBody;

  console.log(`Login attempt for ${email}`);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`User not found: ${email}`);
    return reply.status(401).send({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    console.log(`Invalid password for ${email}`);
    return reply.status(401).send({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '8h' });

  console.log(`Login successful for ${email}, role: ${user.role}`);

  return reply.send({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}
