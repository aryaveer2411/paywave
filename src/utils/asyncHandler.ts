import { Request, Response, NextFunction, RequestHandler } from 'express';

// Properly typed async handler
const asyncHandler = <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
  fnc: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction,
  ) => Promise<any>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    Promise.resolve(fnc(req, res, next)).catch(next);
  };
};

export { asyncHandler };
