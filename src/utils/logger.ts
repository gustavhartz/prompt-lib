import { pino } from "pino";

export const logger = pino({
  name: "PromptLib",
  level: "info",
});
