export class InfraError extends Error {
  constructor(
    public readonly message: string,
    public readonly originalError?: Error,
  ) {
    super(message);
  }
}
