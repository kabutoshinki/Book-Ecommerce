import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LayoutMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalRender = res.render;

    res.render = function (
      view: string,
      options?: any,
      callback?: (err: Error, html: string) => void,
    ) {
      options = options || {};
      options.layout =
        options.layout === undefined ? 'layouts/layout' : options.layout;

      if (options.layout) {
        const layout = options.layout;
        delete options.layout;

        originalRender.call(res, view, options, (err, html) => {
          if (err) {
            if (callback) {
              return callback(err, html);
            } else {
              throw err;
            }
          }

          options.body = html;
          originalRender.call(res, layout, options, callback);
        });
      } else {
        originalRender.call(res, view, options, callback);
      }
    };

    next();
  }
}
