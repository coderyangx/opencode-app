export const ok = <T>(data: T) => ({ ok: true as const, data });
export const err = (error: string) => ({ ok: false as const, error });
