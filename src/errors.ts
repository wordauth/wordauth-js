export class WordAuthError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "WordAuthError";
    this.status = status;
  }
}
