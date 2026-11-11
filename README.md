# ReGo

A modern cross-platform application to help re-box and track inventory for your LEGO sets using Rebrickable.

## Architecture

- **`packages/domain`**: Pure TypeScript domain logic, types, Rebrickable client, and local inventory storage models.
- **`packages/ui`**: Shared Svelte 5 component library with modern LEGO design tokens and dark mode support.
- **`apps/web`**: SvelteKit web application configured with `@sveltejs/adapter-static` for GitHub Pages.
- **`apps/desktop`**: Tauri v2 desktop (macOS, Windows, Linux) and iOS mobile wrapper.

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v10+)
- [Rust](https://www.rust-lang.org/) (v1.75+)
- [mise](https://mise.jdx.dev/) (optional, for task automation)

## Commands

```bash
# Install dependencies
pnpm install

# Run web app in development
pnpm dev

# Run desktop app via Tauri
pnpm desktop:dev

# Run iOS target
pnpm desktop:ios

# Run verification suite (format check, typecheck, tests, and build)
rtk mise run verify
```
