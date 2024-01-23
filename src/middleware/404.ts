"use strict";

import { Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: 404, message: "Not found" });
};

export { notFoundHandler };
