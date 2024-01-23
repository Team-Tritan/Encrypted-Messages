"use strict";

import type { Request, Response } from "express";

const validateRequestBody = (req: Request, res: Response): string | null => {
  const { text } = req.body;

  if (typeof text !== "string" || !text) {
    res.status(400).json({ error: 400, message: "Invalid request body" });
    return null;
  }
  return text;
};

export { validateRequestBody };
