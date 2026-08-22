import {z} from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().min(1).max(65535).default(3000).describe("port must be a number between 1 and 65535"),  
})

const result = envSchema.safeParse(process.env);

if(!result.success) {
    console.error("Invalid environment variables", z.treeifyError(result.error));
    process.exit(1);
}

export const env = result.data;