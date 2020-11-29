import fetch from "node-fetch";
import timeout from "timeout-signal";

interface Response<T> {
  status: number;
  data: T;
}

interface WordPronunciationResponse {
  items: {
    word: string;
    hits: number;
    sex: string;
    country: string;
    code: string;
    langname: string;
    pathmp3: string;
    num_votes: number;
    num_positive_votes: number;
  }[];
}

let apiKey: string | null = null;

const get = async <T>(url: string): Promise<Response<T>> => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    signal: timeout(5000),
  });

  if (res.status !== 200) {
    throw new Error(`unexpected response: ${res.status}`);
  }

  return {
    status: res.status,
    data: await res.json(),
  };
};

export const setKey = (key: string) => {
  apiKey = key;
};

export const wordPronunciations = async (word: string) => {
  const url = [
    "https://apifree.forvo.com/action/word-pronunciations/format/json/word/",
    encodeURIComponent(word),
    "/key/",
    apiKey,
  ].join("");

  return get<WordPronunciationResponse>(url);
};
