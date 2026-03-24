import { FastifyInstance } from 'fastify';
import { UserRepository } from '../repositories/user-repository';

export async function profileRoutes(app: FastifyInstance) {
  const userRepo = new UserRepository(app.prisma);

  app.get('/v1/users/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const user = await userRepo.findById(id);
    if (!user) {
      return reply.status(404).send({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }
    return reply.send({ data: { id: user.id, name: user.name, role: user.role } });
  });
}
