import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PORTAL_CONFIG_ID: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  FIREBASE_SERVICE_ACCOUNT_KEY_ENCODED_JSON: z.string(),
  // Bucket do Firebase Storage. Opcional: se ausente, o Admin SDK fica sem
  // bucket padrao (hoje nada na API usa Storage, so messaging).
  FIREBASE_STORAGE_BUCKET: z.string().optional(),
  RESEND_API_KEY: z.string(),
  RESEND_EMAIL: z.string(),
  // Endereco de contato exibido nos templates de email. Cai no RESEND_EMAIL
  // quando nao definido.
  SUPPORT_EMAIL: z.string().optional(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  // Origens extras liberadas no CORS, separadas por vírgula
  // (previews da Vercel, domínio customizado). O FRONTEND_URL já entra sozinho.
  CORS_ORIGINS: z.string().optional(),
  // Z-API (opcional)
  ZAPI_INSTANCE_ID: z.string().optional(),
  ZAPI_TOKEN: z.string().optional(),
  ZAPI_CLIENT_TOKEN: z.string().optional(),
})

const parsedEnv = envSchema.parse(process.env)

export const env = {
  ...parsedEnv,
  SUPPORT_EMAIL: parsedEnv.SUPPORT_EMAIL ?? parsedEnv.RESEND_EMAIL,
  CORS_ORIGINS: [
    parsedEnv.FRONTEND_URL,
    ...(parsedEnv.CORS_ORIGINS?.split(",") ?? []),
  ]
    .map(origin => origin.trim())
    .filter(Boolean),
  ZAPI:
    parsedEnv.ZAPI_INSTANCE_ID &&
    parsedEnv.ZAPI_TOKEN &&
    parsedEnv.ZAPI_CLIENT_TOKEN
      ? {
          instanceId: parsedEnv.ZAPI_INSTANCE_ID,
          token: parsedEnv.ZAPI_TOKEN,
          clientToken: parsedEnv.ZAPI_CLIENT_TOKEN,
        }
      : undefined,
}
