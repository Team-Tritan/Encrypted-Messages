import axios, { AxiosInstance, AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const instance: AxiosInstance = axios.create({
  baseURL: "http://backend:3000/api/fetch",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response: AxiosResponse = await instance({
      method: req.method?.toLowerCase(),
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
