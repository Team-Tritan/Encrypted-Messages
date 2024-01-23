"use strict";

import express, { type Request, type Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { encryptText, decryptText, validateRequestBody } from "./utils";
import { notFoundHandler, errorHandler } from "./middleware";
import config from "../config";

interface Secret {
  id: string;
  token: string;
  encryptedText: string;
}

const app = express();
app.use(express.json());

const secrets: Record<string, Secret> = {};
const generateId = (): string => uuidv4();

app.post("/new", (req: Request, res: Response) => {
  const text = validateRequestBody(req, res);
  if (!text) return;

  const id = generateId();
  const token = uuidv4();
  const encryptedText = encryptText(text);

  const secret: Secret = { id, token, encryptedText };
  secrets[id] = secret;

  res.status(200).json({ id, token });
});

app.get("/fetch", (req: Request, res: Response) => {
  const { i, t } = req.query;

  if (typeof i !== "string" || typeof t !== "string")
    return res
      .status(400)
      .json({ error: 400, message: "Invalid query parameters" });

  if (!i || !t)
    return res
      .status(400)
      .json({ error: 400, message: "Invalid query parameters" });

  const secret = secrets[i];

  if (!secret || secret.token !== t)
    return res
      .status(404)
      .json({ error: 404, message: "Secret not found or invalid token" });

  const decryptedText = decryptText(secret.encryptedText);

  if (decryptedText) {
    delete secrets[i];
    res.status(200).json({ text: decryptedText });
  } else {
    res
      .status(500)
      .json({ error: 500, message: "Error decrypting the secret" });
  }
});

app.all("*", notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[Backend] Listening on port ${config.port}`);
});
