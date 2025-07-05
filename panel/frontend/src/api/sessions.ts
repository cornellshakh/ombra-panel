import { Session } from "@/lib/schema";

export function preprocessSessionData(data: any): Session {
  const directDateFields: string[] = ["createdAt", "usedAt"];

  directDateFields.forEach((field: string) => {
    if (data[field]) data[field] = new Date(data[field]);
    else data[field] = null;
  });

  return data as Session;
}
