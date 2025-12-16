import { Sandbox } from "e2b";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_ENDPOINT_URL,
  AWS_BUCKET,
} = process.env;

console.log("Creating sandbox...");
const sandbox = await Sandbox.create("expo-app");

// Pull caches, run expo build, and push caches
const command = [
  "scripts/cache-download.sh",
  "npx expo export",
  "scripts/cache-upload.sh",
];

console.log("Running commands...");
const result = await sandbox.commands.run(command.join(" && "), {
  envs: {
    AWS_ACCESS_KEY_ID: AWS_ACCESS_KEY_ID!,
    AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY!,
    AWS_REGION: AWS_REGION!,
    AWS_ENDPOINT_URL: AWS_ENDPOINT_URL!,
    AWS_BUCKET: AWS_BUCKET!,
  },
});

console.log("Commands completed.");
console.log(result);
