"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";

const baseUrl = "https://encrypt.tritan.gg";

const instance = axios.create({
  baseURL: baseUrl + "/api",
});

const Main = () => {
  const router = useRouter();
  const [buttonState, setButtonState] = useState("send");
  const [textareaValue, setTextareaValue] = useState("");

  const handleSend = async () => {
    if (textareaValue.length < 1) {
      alert("Please enter some text.");
      return;
    }

    setTextareaValue("Encrypting...");

    try {
      const response: AxiosResponse = await instance.post("/new", {
        text: textareaValue,
      });
      const url = baseUrl + `?i=${response.data.id}&t=${response.data.token}`;

      setTextareaValue(url);
      setButtonState("copy");
    } catch (error: any) {
      alert("Error: " + error.message);
      setButtonState("reset");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textareaValue);
      alert("Copied to clipboard.");
      setButtonState("reset");
    } catch (err: any) {
      alert("Error: " + err.message);
      setButtonState("reset");
    }
  };

  const handleReset = () => {
    setTextareaValue("");
    setButtonState("send");
  };

  useEffect(() => {
    if (router.isReady && buttonState === "decrypt") {
      const fetchData = async () => {
        try {
          const response: AxiosResponse = await instance.get(
            `/fetch?i=${router.query.i}&t=${router.query.t}`
          );
          setTextareaValue(response.data.text);
        } catch (error: any) {
          setTextareaValue(
            error.response?.data.message || "Error fetching data"
          );
        }
      };

      fetchData();
    }
  }, [buttonState, router.isReady, router.query.i, router.query.t]);

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <title>Encrypt</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>

      <div>
        {(buttonState === "send" || buttonState === "decrypt") && (
          <div className="bg-black text-white h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="max-w-3xl p-8 bg-black rounded-lg border-2 border-purple-500 shadow-lg">
                <h1 className="text-3xl font-semibold mb-4">
                  Speak your mind.
                </h1>
                <p className="text-gray-500 mb-6">
                  End-to-end encrypted. Only you and the receiver can read the
                  message, deleted after the first read.
                </p>
                <div className="mb-6">
                  <textarea
                    id="textarea"
                    rows={8}
                    placeholder="Say some stuff"
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    className="w-full p-2 bg-black outline-none"
                  ></textarea>
                </div>
              </div>
              <button
                id={buttonState}
                onClick={
                  buttonState === "send"
                    ? handleSend
                    : // @ts-ignore
                    buttonState === "copy"
                    ? handleCopy
                    : // @ts-ignore
                    buttonState === "reset"
                    ? handleReset
                    : undefined
                }
                className="mt-10 bg-purple-900 text-white py-2 px-4 w-1/5 rounded-md"
              >
                {buttonState.charAt(0).toUpperCase() + buttonState.slice(1)}
              </button>
            </div>
          </div>
        )}

        {buttonState === "decrypt" && (
          <div className="bg-black text-white h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="max-w-3xl p-8 bg-black rounded-lg border-2 border-purple-500 shadow-lg">
                <h1 className="text-3xl font-semibold mb-4">
                  Speak your mind.
                </h1>
                <p className="text-gray-500 mb-6">
                  End-to-end encrypted. Only you and the receiver can read the
                  message, deleted after the first read.
                </p>
                <div className="mb-6">
                  <textarea
                    id="textarea"
                    rows={8}
                    placeholder="Say some stuff"
                    value={textareaValue}
                    readOnly
                    className="w-full p-2 bg-black outline-none"
                  ></textarea>
                </div>
              </div>
              <button
                id="reset"
                onClick={handleReset}
                className="mt-10 bg-purple-900 text-white py-2 px-4 w-1/5 rounded-md"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
