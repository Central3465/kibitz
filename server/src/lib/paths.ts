import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// server/dist/lib -> project root, independent of the working directory
export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

export const clientDistPath = resolve(projectRoot, "client/dist");
export const clientPublicPath = resolve(projectRoot, "client/public");
