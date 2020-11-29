import { join } from "path";
import { execSync } from "child_process";

export default async () => {
  const asset = join(__dirname, "dist/mac/Forvilo.app/Contents/Info.plist");
  execSync(`/usr/libexec/PlistBuddy -c 'add LSUIElement string 1' "${asset}"`, { stdio: "inherit" });
};
