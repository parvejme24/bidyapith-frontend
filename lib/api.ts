import { DB } from "@/lib/data";
import type { ApiEnvelope, Collection, Database } from "@/lib/types";

const DEFAULT_DELAY_MS = 200;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function get<K extends Collection>(
  collection: K,
  options: { delay?: number } = {},
): Promise<ApiEnvelope<Database[K]>> {
  const delay = options.delay ?? DEFAULT_DELAY_MS;
  if (delay > 0) await wait(delay);

  return {
    success: true,
    message: "Operation successful",
    data: DB[collection],
  };
}

export function deptName(id: string) {
  const department = DB.departments.find((item) => item.id === id);
  return department ? department.name : id;
}

export function deptShort(id: string) {
  return (DB.departments.find((item) => item.id === id)?.name || id).replace(
    / ?& ?Engineering/,
    "",
  );
}

export const api = {
  get,
  deptName,
  deptShort,
};
