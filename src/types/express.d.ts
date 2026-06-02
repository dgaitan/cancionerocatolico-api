declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string };
      validated?: Record<string, unknown>;
    }
  }
}

export {};
