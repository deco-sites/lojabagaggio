// deno-lint-ignore no-explicit-any
export const useCallback = <T extends (...args: any[]) => any>(
  fn: T,
  ...params: Parameters<T>
) => `(${fn.toString()})(${params.map((p) => JSON.stringify(p)).join(", ")})`;
