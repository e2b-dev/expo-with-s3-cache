import { Sandbox } from "e2b";

const timeoutMs = 10 * 60 * 1000; // 10 minutes

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_ENDPOINT_URL,
  AWS_BUCKET,
} = process.env;

console.log("Creating sandbox...");
const sandbox = await Sandbox.create("expo-app", { timeoutMs });

const command = `
  scripts/cache-download.sh &&
  npx expo export &&
  scripts/cache-upload.sh
`;

console.log("Running commands:", command);
const result = await sandbox.commands.run(command, {
  envs: {
    AWS_ACCESS_KEY_ID: AWS_ACCESS_KEY_ID!,
    AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY!,
    AWS_REGION: AWS_REGION!,
    AWS_ENDPOINT_URL: AWS_ENDPOINT_URL!,
    AWS_BUCKET: AWS_BUCKET!,
    // CACHE_FILENAME: "metro-cache-test.tar.gz", // set a custom cache filename
  },
  timeoutMs: 0, // disable timeout for the command
});

console.log("Commands completed.");
console.log(result);

console.log("Killing sandbox...");
await sandbox.kill();
