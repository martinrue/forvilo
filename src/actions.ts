import { IpcMainEvent, ipcMain, ipcRenderer, IpcRendererEvent } from "electron";

type Action = "hide-window" | "save-api-key" | "fetch-pronunciations";
type Event = "fetched-pronunciations";

interface ActionHandler {
  action: Action;
  fn: (event: IpcMainEvent, ...args: any[]) => void;
}

interface EventHandler {
  event: Event;
  fn: (event: IpcRendererEvent, ...args: any[]) => void;
}

export const registerActions = (...handlers: ActionHandler[]) => {
  handlers.forEach((handler) => ipcMain.on(handler.action, handler.fn));
};

export const registerEvents = (...handlers: EventHandler[]) => {
  handlers.forEach((handler) => ipcRenderer.on(handler.event, handler.fn));
};

export const dispatch = (action: Action, ...args: any[]) => {
  ipcRenderer.send(action, ...args);
};

export const reply = (event: Event, sender: Electron.webContents, ...args: any[]) => {
  sender.send(event, ...args);
};
