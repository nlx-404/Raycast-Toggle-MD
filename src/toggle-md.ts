// src/index.tsx
import { showHUD } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default async function Command() {
  try {
    // Toggle menu bar using AppleScript
    const menuBarScript = `
      tell application "System Events"
        tell dock preferences to set autohide menu bar to not autohide menu bar
      end tell
    `;
    await execAsync(`osascript -e '${menuBarScript}'`);

    // Get current dock state and toggle it
    const { stdout: dockState } = await execAsync("defaults read com.apple.dock autohide");
    const isDockHidden = dockState.trim() === "1";
    const newDockState = !isDockHidden;

    // Set new dock state
    await execAsync(`defaults write com.apple.dock autohide -bool ${newDockState}`);

    // Restart Dock to apply changes
    await execAsync("killall Dock");

    await showHUD("Menu Bar and Dock Toggled");
  } catch (error) {
    console.error("Failed to toggle:", error);
    await showHUD("Failed to toggle Menu Bar and Dock");
  }
}
