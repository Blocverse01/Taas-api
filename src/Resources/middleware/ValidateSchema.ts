import { Request, Response, NextFunction } from "express";
import * as Yup from "yup";
import { BAD_REQUEST } from "../constants/statusCodes";

const validateRequestInput = (schema: Yup.AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      return res.status(BAD_REQUEST).json({ error: error.message });
    }
  };
};

export { validateRequestInput };
