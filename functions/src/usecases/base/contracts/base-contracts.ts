export type RepositoryAction<T, P extends unknown[]> = (
  ...args: P
) => Promise<T>;
