/**
 * Builds any workspace whose output is missing, so that `npm start`
 * works straight after `npm install`. Use `npm run build` to rebuild
 * everything after making changes.
 */
const { existsSync } = require("fs");
const { resolve } = require("path");
const { spawnSync } = require("child_process");

const root = resolve(__dirname, "..");

// Order matters: client and server depend on shared
const workspaces = [
    { name: "shared", output: "shared/dist" },
    { name: "server", output: "server/dist/index.js" },
    { name: "client", output: "client/dist/analysis.bundle.js" }
];

const npm = process.platform == "win32" ? "npm.cmd" : "npm";

for (const workspace of workspaces) {
    if (existsSync(resolve(root, workspace.output))) continue;

    console.log(`building ${workspace.name} (first run, this may take a minute)...`);

    const result = spawnSync(npm, ["run", "build", "-w", workspace.name], {
        cwd: root,
        stdio: "inherit",
        shell: process.platform == "win32"
    });

    if (result.status != 0) {
        console.error(`failed to build ${workspace.name}.`);
        process.exit(result.status || 1);
    }
}
