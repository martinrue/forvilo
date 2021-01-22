import { IpcMainEvent, app, globalShortcut } from "electron";

import { createWindow, Window } from "./window";
import { createTrayMenu } from "./tray";
import { registerActions, reply } from "./actions";

import * as store from "./store";
import * as api from "./api";

const fetchPronunciations = async (event: IpcMainEvent, search: string) => {
  const parseQuery = (parts: string[]) => {
    const query = {
      sex: "",
      code: "",
      country: "",
    };

    const countryParts: string[] = [];

    parts.forEach((p) => {
      if (p === "f" || p === "m") {
        query.sex = p.toLowerCase();
        return;
      }

      if (p.length === 2 || p.length === 3) {
        query.code = p.toLowerCase();
        return;
      }

      countryParts.push(p);
    });

    query.country = countryParts.join(" ").toLowerCase();
    return query;
  };

  try {
    const parts = search.split(" ");
    const results = await api.wordPronunciations(parts[0]);
    const query = parseQuery(parts.slice(1));

    const items = [...results.data.items].filter((item) => {
      const wordMatch = item.word.toLowerCase() === parts[0].toLowerCase();
      const codeMatch = !query.code || query.code === item.code.toLowerCase();
      const sexMatch = !query.sex || query.sex === item.sex.toLowerCase();
      const countryMatch = !query.country || item.country.toLowerCase().indexOf(query.country) !== -1;
      return wordMatch && codeMatch && sexMatch && countryMatch;
    });

    items.sort((a, b) => b.hits - a.hits);

    const pronunciations = items.slice(0, 10).map((item, index) => {
      return {
        index: index + 1,
        code: item.code,
        voice: item.sex,
        country: item.country,
        pathmp3: item.pathmp3,
      };
    });

    reply("fetched-pronunciations", event.sender, pronunciations);
  } catch (err) {
    console.error(err);
    reply("fetched-pronunciations", event.sender, []);
  }
};

const init = () => {
  const config = store.load();

  const createNewWindow = () => {
    const window = createWindow({ allowQuit: false });
    window.load(config.apiKey ? "pronounce" : "api-key");
    return window;
  };

  let window: Window | null;

  api.setKey(config.apiKey);

  registerActions(
    {
      action: "hide-window",
      fn: () => window?.hide(),
    },
    {
      action: "save-api-key",
      fn: (_, key: string) => {
        store.setKey(key);
        api.setKey(key);
        window?.load("pronounce");
      },
    },
    {
      action: "fetch-pronunciations",
      fn: fetchPronunciations,
    },
    {
      action: "set-input-window-height",
      fn: (_, height: number) => {
        window?.setHeight(height, true);
      },
    }
  );

  createTrayMenu([
    {
      label: "Quit",
      click: () => {
        window?.shouldQuit();
        app.quit();
      },
    },
  ]);

  globalShortcut.register("Control+Shift+P", () => {
    if (window?.isShown()) {
      window.hide();
      return;
    }

    window?.close();
    window = createNewWindow();

    window.toggle();
    window.center();
    window.focus();
  });
};

app.dock.hide();

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform === "darwin") {
    return;
  }

  app.quit();
});

app.whenReady().then(init);
