import express from "express";
import dotenv from "dotenv";

import mainRouter from "./routes";

dotenv.config();

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "production";

const app = express();

app.disable("x-powered-by");

// Static assets
app.use("/",
    express.static("client/dist", { maxAge: "1h" }),
    express.static("client/public", { maxAge: "1d" })
);

// Pages
app.use("/", mainRouter);

app.listen(port, () => {
    console.log(`server running on port ${port} (${nodeEnv} mode)`);
});
