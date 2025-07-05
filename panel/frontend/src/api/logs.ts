import { ServerLog, ServerLogSchema } from "@/lib/schema";

export function preprocessLogData(data: any): ServerLog {
  if (Object.keys(data).length === 0) {
    return ServerLogSchema.parse({});
  }

  const directDateFields = ["date"];
  directDateFields.forEach((field) => {
    if (data[field]) {
      data[field] = new Date(data[field]);
    } else {
      data[field] = null;
    }
  });

  return data as ServerLog;
}
