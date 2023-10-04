export class InternalError extends Error {
  constructor(
    public message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super(message);
    //config para para melhorar ao debugar
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
