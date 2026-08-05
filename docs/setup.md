# Project Environment Setup

Welcome to the project! To ensure code consistency across all team members, we automate code formatting (Prettier) and code quality checks (ESLint) directly inside Visual Studio Code.

Follow these steps to set up your environment.

## 1. Install Required VS Code Extensions

Open VS Code, go to the Extensions tab (`Ctrl+Shift+X` or `Cmd+Shift+X`), and install the following official plugins:

- **ESLint** (Publisher: `Microsoft`) — Catches logic errors and code smells.
- **Prettier - Code formatter** (Publisher: `Prettier`) — Formats code automatically.

---

## 2. Workspace Automation Configuration

We enforce uniform IDE behavior through the local workspace settings. Ensure you have a `.vscode/settings.json` file in the root of your project with the following configuration:

```json
{
  //   "files.autoSave": "onFocusChange",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### How this workflow works for you:

1.  **Write Code Freely:** Write your code without worrying about indentation, spacing, quotes, or semi-colons.
2.  **Auto-Format & Fix:** As soon as you switch windows (e.g., to check your browser or open a terminal), VS Code automatically triggers **Prettier** to beautify your files and **ESLint** to fix minor issues (like removing unused imports).
3.  **Manual Formatting:** If you want to preview the formatting _before_ changing focus, press `Shift+Alt+F` (Windows) or `Shift+Option+F` (macOS).

---

## 3. Line Endings (Windows Users Only)

To prevent Git formatting conflicts between Windows (CRLF) and Linux/macOS (LF), we enforce **LF** line endings.
Our repository includes a `.gitattributes` file that forces this automatically, but please configure your global Git settings as a safety measure:

```bash
git config --global core.autocrlf true
```
