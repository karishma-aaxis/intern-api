// Custom error class for application-specific HTTP errors
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    // Call the parent Error constructor
    super(message);

    // Set a custom error name for debugging
    this.name = "HttpError";
  }
}