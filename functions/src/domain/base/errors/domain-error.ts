export class DomainError extends Error {
  constructor(
    public readonly message: string,
    public readonly originalError?: Error,
  ) {
    super(message);
  }
}
