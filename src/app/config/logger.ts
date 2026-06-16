export const loggerConfig = {
  level: process.env.LOG_LEVEL || "info",
  silent: process.env.NODE_ENV === "test"
};
