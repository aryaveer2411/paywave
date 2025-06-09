import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { asyncHandler } from './asyncHandler';

function serviceRouter(routePrefix: string, targetBaseUrl: string) {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const proxiedPath = req.originalUrl.slice(routePrefix.length);
      const url = targetBaseUrl + proxiedPath;
      const method = req.method.toLowerCase();

      console.log(`[Proxy] ${method.toUpperCase()} ${url}`);

      try {
        const config: any = {
          method,
          url,
          headers: {
            ...req.headers,
            host: undefined,
            'content-length': undefined,
          },
          validateStatus: () => true,
        };

        if (['post', 'put', 'patch'].includes(method)) {
          config.data = req.body;
        }

        const response = await axios(config);

        res.status(response.status).set(response.headers).send(response.data);
      } catch (error: any) {
        console.error('[Proxy Error]', error);
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
