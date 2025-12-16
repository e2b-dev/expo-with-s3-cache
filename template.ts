import { Template, waitForURL } from "e2b";

export default Template()
  .fromNodeImage()
  .aptInstall("awscli")
  .setWorkdir("/home/user/expo-app")
  .runCmd("npx create-expo-app@latest . --yes")
  .runCmd("mv /home/user/expo-app/* /home/user/ && rm -rf /home/user/expo-app")
  .setWorkdir("/home/user")
  .copy("scripts", "scripts/")
// optionally set start cmd
// .setStartCmd(
//   "scripts/cache-download.sh && npx expo start && scripts/cache-upload.sh",
//   waitForURL("http://localhost:8081")
// );
