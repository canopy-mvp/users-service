import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function activityRoutes(app: any) {
  app.get('/v1/users/:id/activity', async (req: any, reply: any) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    console.log(`Fetching activity for user ${user?.email} from IP ${req.ip}`);
    const activities = await prisma.activity.findMany({
      where: { userId: req.params.id },
      include: { user: { select: { email: true, phone: true, name: true } } },
    });
    return reply.send({ data: activities });
  });
}
