// VIOLATION: console.log with email and IP
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function loginRoutes(app: FastifyInstance) {
  app.post('/v1/auth/login', async (req, reply) => {
    const { email, password } = req.body as any;

    console.log(`Login attempt from ${email} at IP ${req.ip}`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`Failed login: user not found for ${email}`);
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      console.log(`Failed login: wrong password for ${email} from ${req.ip}`);
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    console.log(`Successful login for ${email}`);
    return reply.send({ token: 'jwt_token_here', user: { id: user.id, email: user.email } });
  });
}
