"use strict";

import express, { type Request, type Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { encryptText, decryptText, validateRequestBody, RedisWrapper } from "./utils";
import { notFoundHandler, errorHandler } from "./middleware";
import config from "./config";

interface Secret {
  id: string;
  token: string;
  encryptedText: string;
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "pages");
app.disable("x-powered-by");

const redisWrapper = new RedisWrapper();
const generateId = (): string => uuidv4();

app.get("/", (req: Request, res: Response) => {
  let { i, t } = req.query;

  if (i && t)
    return res.render("index.ejs", { i, t, encrypt: false, decrypt: true });
  else return res.render("index.ejs", { i, t, encrypt: true, decrypt: false });
});

app.post("/api/new", async (req: Request, res: Response) => {
  const validReq = validateRequestBody(req, res);
  if (!validReq) return;

  try {
    const id = generateId();
    const token = generateId();
    const encryptedText = encryptText(validReq.text);

    const secret: Secret = { id, token, encryptedText };

    redisWrapper.set(id, JSON.stringify(secret), validReq.hours);

    res.status(200).json({ id, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 500, message: "Error encrypting." });
  }
});

app.get("/api/fetch", async (req: Request, res: Response) => {
  const { i, t } = req.query;

  if (typeof i !== "string" || typeof t !== "string")
    return res
      .status(400)
      .json({ error: 400, message: "Invalid query parameters." });

  if (!i || !t)
    return res
      .status(400)
      .json({ error: 400, message: "Invalid query parameters." });

  try {
    const secret = (await redisWrapper.get(i)) as string;
    const secretParsed = JSON.parse(secret) as Secret;

    if (!secret)
      return res.status(404).json({
        error: 404,
        message: "The decrypted message could not be found on the server.",
      });

    if (secretParsed.token !== t)
      return res.status(403).json({
        error: 403,
        message: "The token provided is not valid.",
      });

    const decryptedText = decryptText(secretParsed.encryptedText);

    if (decryptedText) {
      await redisWrapper.del(i);
      return res.status(200).json({ text: decryptedText });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 500, message: "Error decrypting." });
  }
});

app.all("*", notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[Backend] Listening on port ${config.port}`);
});
