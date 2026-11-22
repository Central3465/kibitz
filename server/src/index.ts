import express from "express";
import dotenv from "dotenv";
import { resolve } from "path";

import mainRouter from "./routes";
import {
    projectRoot,
    clientDistPath,
    clientPublicPath
} from "@/lib/paths";

dotenv.config({ path: resolve(projectRoot, ".env") });

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "production";

const app = express();

app.disable("x-powered-by");

// Static assets
app.use("/",
    express.static(clientDistPath, { maxAge: "1h" }),
    express.static(clientPublicPath, { maxAge: "1d" })
);

// Pages
app.use("/", mainRouter);

app.listen(port, () => {
    console.log(
        `server running at http://localhost:${port} (${nodeEnv} mode)`
    );
});
