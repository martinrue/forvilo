import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { app } from "electron";

interface Store {
  apiKey: string;
}

let store: Store = { apiKey: "" };
const storeFile = join(app.getPath("home"), ".forvilo");

export const get = () => {
  return store;
};

export const save = (): Store => {
  writeFileSync(storeFile, JSON.stringify(store));
  return get();
};

export const load = (): Store => {
  if (!existsSync(storeFile)) {
    return save();
  }

  store = JSON.parse(readFileSync(storeFile).toString());
  return get();
};

export const setKey = (key: string) => {
  store.apiKey = key;
  save();
};
