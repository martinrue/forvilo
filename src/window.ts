import { BrowserWindow, screen } from "electron";

export interface Window {
  load: (id: "api-key" | "pronounce") => void;
  center: () => void;
  setHeight: (height: number, animate: boolean) => void;
  shouldQuit: () => void;
  toggle: () => void;
  hide: () => void;
  isShown: () => boolean;
  focus: () => void;
  close: () => void;
}

export const createWindow = ({ allowQuit = true }: { allowQuit: boolean }): Window => {
  const window = new BrowserWindow({
    width: 450,
    height: 0,
    frame: false,
    resizable: false,
    center: false,
    opacity: 0.98,
    show: false,
    skipTaskbar: true,
    darkTheme: true,
    backgroundColor: "#151515",
    webPreferences: {
      scrollBounce: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  window.setAlwaysOnTop(true);

  window.on("close", (e: Electron.Event) => {
    if (!allowQuit) {
      e.preventDefault();
    }
  });

  const load = (id: "api-key" | "pronounce") => {
    if (id === "api-key") {
      window.setSize(450, 160);
      window.loadFile("src/views/api-key/index.html");
    }

    if (id === "pronounce") {
      window.setSize(450, 52, true);
      window.loadFile("src/views/pronounce/index.html");
    }
  };

  const center = (animate = false) => {
    const currentScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    const [width] = window.getSize();
    const x = currentScreen.bounds.x + currentScreen.bounds.width / 2 - width / 2;
    window.setPosition(x, 200, animate);
  };

  const setHeight = (height: number, animate = true) => {
    window.setSize(window.getBounds().width, height, animate);
  };

  const shouldQuit = () => (allowQuit = true);
  const toggle = () => (window.isVisible() ? window.hide() : window.show());
  const hide = () => window.hide();
  const isShown = () => window.isVisible();
  const focus = () => window.focus();

  const close = () => {
    allowQuit = true;
    window.close();
  };

  return {
    load,
    center,
    setHeight,
    shouldQuit,
    toggle,
    hide,
    isShown,
    focus,
    close,
  };
};
