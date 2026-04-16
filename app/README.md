# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Wedding photos (replace all car JPGs)

The site references these image filenames (kept for compatibility with existing layout + animations):

- `public/images/black-rose-hero.jpg`
- `public/images/car-exterior-1.jpg`
- `public/images/car-front.jpg`
- `public/images/car-grille.jpg`
- `public/images/car-interior.jpg`
- `public/images/car-rear.jpg`
- `public/images/car-top.jpg`
- `public/images/car-wheel.jpg`

### Option A (recommended): auto-apply your photos

1) Put at least **8** images (jpg/jpeg/png/webp) into any folder, e.g. `C:\wedding-photos\`.

2) Run:

```powershell
pwsh -File .\tools\apply-wedding-photos.ps1 -SourceDir "C:\wedding-photos"
```

This copies your first 8 photos (sorted by name) into `public/images/` with the correct filenames.

### Option A2 (best control): map specific photos to sections

1) Put your photos into a folder, e.g. `C:\wedding-photos\`
2) Copy `tools/photo-map.example.json` to `tools/photo-map.json` and edit the right-side filenames to match your folder
3) Run:

```powershell
pwsh -File .\tools\apply-wedding-photos.ps1 -SourceDir "C:\wedding-photos" -MapFile ".\tools\photo-map.json"
```

### Option B: manual replace

Just replace the files in `public/images/` while keeping the same filenames.
