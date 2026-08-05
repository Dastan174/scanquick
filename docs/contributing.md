# Contributing to the Project

Thank you for contributing! To maintain high code quality and a clean Git history, this project uses a automated **Workflow Protection** system powered by **Husky**, **lint-staged**, and **Commitlint**.

---

## Automated Commit Protection (Husky)

When you run `git commit`, Husky intercepts the action and triggers two verification layers:

1.  **Code Validation (`lint-staged`):** It runs `next lint --fix` and `prettier --write` **only on the files you modified**. If there are critical ESLint errors (like `no-debugger` or unresolved bugs), your commit will be blocked.
2.  **Commit Message Validation (`commitlint`):** It analyzes your commit text. If it doesn't follow the standards below, the commit fails.

---

## Commit Message Standards

We strictly follow the **Conventional Commits** specification. Every commit message must match this anatomy:

```text
type(scope): subject
```

### 1. Allowed Types (`type`)

Your commit must start with one of these lower-case keys:

- `feat` — A new user-facing feature or component.
- `fix` — A bug fix.
- `refactor` — Restructuring code without changing logic or features.
- `perf` — Code changes that improve application performance.
- `test` — Adding or correcting test cases.
- `docs` — Modifying documentation (like this file or README).
- `chore` — Updating npm dependencies, configurations, or tooling.
- `build` — Build system changes (`next.config.js`, `package.json`, etc.).
- `ci` — CI/CD workflow updates (GitHub Actions scripts).

### 2. Context Scope (`scope`)

The scope is optional but recommended. It represents the section of the app you worked on. It **must be written in lower-case**.

- _Examples:_ `auth`, `user`, `dashboard`, `payment`, `api`, `ui`.

### 3. Message Rules (`subject`)

- **Must** be entirely in lower-case.
- **Must not** start with a capital letter.
- **Must not** end with a period (`.`).
- **Must** be under 72 characters long.

---

## Examples

### ✅ Valid Commits (Will Pass)

- `feat(auth): add google oauth login flow`
- `fix(payment): resolve stripe timeout error on checkout`
- `docs: update installation steps in setup md`
- `refactor(ui): convert button component to tailwind classes`

### ❌ Invalid Commits (Will be BLOCKED)

- `Fix: fixed login bug.` _(Errors: Capital 'F', Capital 'L', ends with a period)_
- `feat(Auth): Add login` _(Errors: Capital 'A' in scope, Capital 'A' in subject)_
- `added new navbar component` _(Error: Missing valid type prefix like 'feat:')_

---

## ATTENTION

If your commit was canceled DO not paste your commit again.
First correct your file via errors and do:

```bash
# again
git add -A
# then
git commit -m "feat(ui): your correct message here"

```

## Troubleshooting Pro-Tip

If Husky blocks your commit because of a typo in the message, your files remain safely staged! You don't need to redo your work. Just re-run the commit command with a corrected message:

```bash
git commit -m "feat(ui): your correct message here"
```
