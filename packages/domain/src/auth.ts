export interface RebrickableAuth {
  readonly apiKey: string;
  readonly userToken: string;
}

export const REBRICKABLE_AUTH_STORAGE_KEY = "rebrickableAuth";

export function loadAuthFromStorage(storage: Storage): RebrickableAuth | null {
  try {
    const raw = storage.getItem(REBRICKABLE_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RebrickableAuth>;
    if (
      typeof parsed.apiKey === "string" &&
      typeof parsed.userToken === "string" &&
      parsed.apiKey.trim().length > 0 &&
      parsed.userToken.trim().length > 0
    ) {
      return {
        apiKey: parsed.apiKey.trim(),
        userToken: parsed.userToken.trim(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveAuthToStorage(storage: Storage, auth: RebrickableAuth): void {
  storage.setItem(REBRICKABLE_AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuthFromStorage(storage: Storage): void {
  storage.removeItem(REBRICKABLE_AUTH_STORAGE_KEY);
}
