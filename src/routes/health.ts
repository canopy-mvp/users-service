export async function healthRoutes(app: any) {
  app.get('/health', async () => ({ status: 'ok', service: 'users-service' }));
}
