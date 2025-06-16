import { z } from 'zod';

const envServerSchema = z.object({
	DATABASE_URL: z
		.string({
			required_error: 'DATABASE_URL is required',
		})
		.min(4, 'DATABASE_URL must be at least 4 characters long'),
	FRONTEND_URL: z
		.string({
			required_error: 'FRONTEND_URL is required',
		})
		.min(4, 'FRONTEND_URL must be at least 4 characters long'),
	SMTP_HOST: z
		.string({
			required_error: 'SMTP_HOST is required',
		})
		.min(4, 'SMTP_HOST must be at least 4 characters long'),
        SMTP_USER: z
		.string({
			required_error: 'SMTP_USER is required',
		})
		.min(4, 'SMTP_USER must be at least 4 characters long'),
        SMTP_PASSWORD: z
		.string({
			required_error: 'SMTP_PASSWORD is required',
		})
		.min(4, 'SMTP_PASSWORD must be at least 4 characters long'),
        SMTP_PORT: z.coerce.number(),
        // OPENAI_API_KEY:z.string().optional().nullable()
});

export const serverEnv = envServerSchema.parse(process.env);

declare global {
    namespace NodeJS {
      interface ProcessEnv extends z.infer<typeof envServerSchema> {}
    }
  }
