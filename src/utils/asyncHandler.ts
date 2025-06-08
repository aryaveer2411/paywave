import { Request, Response, NextFunction, RequestHandler } from 'express';

const asyncHandler =
  (fnc: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fnc(req, res, next)).catch(next);
  };

export { asyncHandler };
