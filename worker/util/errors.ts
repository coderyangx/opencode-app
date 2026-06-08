export class UnauthorizedError extends Error {
  constructor(msg = 'Unauthorized') {
    super(msg);
    this.name = 'UnauthorizedError';
  }
}

export class IllegalArgumentError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'IllegalArgumentError';
  }
}

export class NotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'NotFoundError';
  }
}
