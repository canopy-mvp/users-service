import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function changePasswordRoutes(app: any) {
  app.post('/v1/users/:id/change-password', async (req: any, reply: any) => {
    const { current_password, new_password } = req.body as any;
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    const valid = await bcrypt.compare(current_password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ message: 'Current password is incorrect' });
    }
    const hashed = await bcrypt.hash(new_password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashed } });
    console.log(`Password changed for user ${user.id}`);
    return reply.send({ message: 'Password changed successfully' });
  });
}
