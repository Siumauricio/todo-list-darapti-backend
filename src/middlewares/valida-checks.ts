import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export function validateChecks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  next();
}
