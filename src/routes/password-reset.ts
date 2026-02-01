export async function passwordResetRoutes(app: any) {
  app.post('/v1/auth/reset-password', async (req: any, reply: any) => {
    return reply.status(202).send({ message: 'Password reset email sent' });
  });
}
