import {z} from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().min(1).max(65535).default(3000).describe("port must be a number between 1 and 65535"),  
    DATABASE_URL: z.url().describe("database url must be a valid url"),
})

const result = envSchema.safeParse(process.env);

if(!result.success) {
    console.error("Invalid environment variables", z.flattenError(result.error));
    process.exit(1);
}

export const env = result.data;