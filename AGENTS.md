# AGENTS.md — users-service

## Repository context
This is the NovaPay users-service, a TypeScript/Fastify microservice handling
user authentication, profile management, and session handling.

## Agent instructions
- Always use the repository pattern for database access (see src/repositories/)
- Never log PII (email, phone, name) — log only user_id
- All endpoints require authentication middleware
- Use Zod schemas in src/schemas/ for request validation
- Follow the error handling pattern in src/middleware/error-handler.ts
- Database migrations go in prisma/migrations/, never modify the schema directly

## Key patterns
- **Auth middleware**: `src/middleware/auth.ts` — validates JWT and attaches user context
- **Repository pattern**: `src/repositories/user.repo.ts` — only layer that touches Prisma
- **Error handling**: throw `AppError` with error codes, never return raw DB errors

## Do NOT
- Do not use Express — this service uses Fastify
- Do not store passwords in plain text — always bcrypt with salt rounds >= 12
- Do not skip input validation on any endpoint
- Do not return user email or phone in list endpoints (only in get-by-id with auth)
