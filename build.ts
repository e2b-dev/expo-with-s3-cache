import { Template, defaultBuildLogger } from "e2b";
import template from "./template.ts";

Template.build(template, {
  alias: "expo-app",
  cpuCount: 4,
  memoryMB: 8192,
  onBuildLogs: defaultBuildLogger(),
});
