import { NextFunction, Request, Response, RequestHandler } from "express";
import { ZodType } from "zod";


export const validateRequest = (schema: ZodType): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      next();
    } catch (err) {
      next(err); 
    }
  };
};