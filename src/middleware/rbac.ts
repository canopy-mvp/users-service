export type Role = 'admin' | 'merchant' | 'support' | 'viewer';

export function requireRole(...roles: Role[]) {
  return async (req: any, reply: any) => {
    if (!roles.includes(req.user?.role)) {
      return reply.status(403).send({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
    }
  };
}
