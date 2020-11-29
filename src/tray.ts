import * as path from "path";
import { Menu, Tray } from "electron";

interface MenuItem {
  label: string;
  click: () => void;
}

let tray = null;

export const createTrayMenu = (items: MenuItem[]) => {
  tray = new Tray(path.join(__dirname, "./images/TrayTemplate.png"));
  tray.setContextMenu(Menu.buildFromTemplate(items));
};
