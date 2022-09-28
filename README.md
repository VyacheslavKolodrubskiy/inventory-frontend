![CRM-starter-template-preview-sm](https://user-images.githubusercontent.com/31849021/163927388-d8d5d0c4-5721-472d-9cd2-03ecfb6b2653.jpg)

## Features

- ⚡ [Vue 3](https://github.com/vuejs/vue-next), [Vite 2](https://github.com/vitejs/vite), [pnpm](https://pnpm.io) - Fast & Furious

- 📦 [Auto import API](https://github.com/antfu/unplugin-auto-import)

- 🔥 Use the [new `<script setup>` style](https://github.com/vuejs/rfcs/pull/227)

- 🍍 State Management via [Pinia](https://pinia.vuejs.org)

- 🌏 [Vue i18n](https://vue-i18n.intlify.dev/) + lazy messages import

- 💪 TypeScript

- 👁 Strong [Eslint](https://eslint.org) support + autofix

- 🐜 [Ant Design Vue](https://www.antdv.com/components/overview)

- 📦 [Autoimport AndDV Icons](https://github.com/antfu/unplugin-vue-components)

- 📈 Charts with incredible [G2Plot](https://g2plot.antv.vision/en/examples/gallery)

- ✨ [LESS](https://lesscss.org/) for easy compatible with ant design styles

- ✅ Use [Vitest](http://vitest.dev/) for unit and components testing

- 🔗 Github Test CI when Push or Pull Request  

- 🐶 Git pre-commit and commit-msg hooks with [Husky](https://typicode.github.io/husky) and [Lint-Staged](https://github.com/okonet/lint-staged)


### Checklist for new project
When you use this template, do the folowing:
- If you don't have [pnpm](https://pnpm.io) installed, run: `npm install -g pnpm`
``` bash
# Install dependencies
$ pnpm i
```
- You need to update the `.env` file according to new project
- You need to create the `.env.production` file copying from `.env.production.example` at the root folder:
```bash
# Do it by run command below or manually
# unix
$ cp .env.production.example .env.production
# cmd
$ copy .env.production.example .env.production
```
And enjoy the template :)

## Usage
The starter contains following scripts:
- `dev` - compiles and hot-reloads for development
- `build` - compiles and minifies for production
- `preview` - launch local server for preview production build
- `lint` - lint all files
- `lint:fix` - lint and fix all files
- `typecheck` - typecheck
- `report:ts` - typescript coverage analysis
- `report:pkg` - package file volume analysis
- `report:css` - browse your utilities usages, have an overview of your design system
- `prepare` - script for setting up husky pre-commit hook
- `release` - [update version](https://github.com/antfu/bumpp) by semver, commit and push with new version tag
