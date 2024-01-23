"use strict";

import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    error: 500,
    message: "Internal server error",
    stacktrace: err.stack,
  });
};

export { errorHandler };
