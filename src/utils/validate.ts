"use strict";

import type { Request, Response } from "express";

const validateRequestBody = (
  req: Request,
  res: Response
): { text: string; hours: number } | null => {
  let { text, hours } = req.body;

  if (typeof text !== "string" || !text) {
    res.status(400).json({ error: 400, message: "Invalid request body" });
    return null;
  }

  if (typeof hours !== "number" || !hours) {
    // default expires in 72 hours if not provided
    hours = 72;
  }

  return { text, hours };
};

export { validateRequestBody };
