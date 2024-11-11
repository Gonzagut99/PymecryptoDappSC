import "dotenv/config";
import { z } from "zod";

// SEPOLIA_PRIVATE_KEY = ""
// ALCHEMY_API_KEY = ""
// ETHERSCAN_API_KEY = ""

interface EnvVars {
    SEPOLIA_PRIVATE_KEY: string;
    ALCHEMY_API_KEY: string;
    ETHERSCAN_API_KEY: string;
}

const envsSchema = z.object({
    SEPOLIA_PRIVATE_KEY: z.string(),
    ALCHEMY_API_KEY: z.string(),
    ETHERSCAN_API_KEY: z.string(),
}).passthrough(); // Allows additional environment variables

const parsed = envsSchema.safeParse(process.env);
if (!parsed.success) {
    throw new Error(`Config validation error: ${parsed.error.message}`);
}

export const envVars: EnvVars = parsed.data;

export const envs = {
    SEPOLIA_PRIVATE_KEY: envVars.SEPOLIA_PRIVATE_KEY,
    ALCHEMY_API_KEY: envVars.ALCHEMY_API_KEY,
    ETHERSCAN_API_KEY: envVars.ETHERSCAN_API_KEY,
};
