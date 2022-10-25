import { Secret } from "jsonwebtoken";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number,
            DB_URI: string,
            JWT_TOKEN: Secret,
            ALLOW_ORIGIN: string[],
        }
    }
}

export { };