import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { asyncHandler } from './asyncHandler';

function serviceRouter(routePrefix: string, targetBaseUrl: string) {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const proxiedPath = req.originalUrl.replace(routePrefix, '');
      const url = targetBaseUrl + proxiedPath;
      const method = req.method.toLowerCase();
      console.log(url);
      try {
        const response = await axios({
          method,
          url,
          data: req.body,
          headers: { ...req.headers, host: undefined },
          validateStatus: () => true,
        });
        res.status(response.status).set(response.headers).send(response.data);
      } catch (error: any) {
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          next(error);
        }
      }
    },
  );
}

export { serviceRouter };
