export type InfraAction<T, P extends unknown[]> = (...args: P) => Promise<T>;
