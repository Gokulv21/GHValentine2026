# GHValentine2026

A beautiful, interactive Valentine's Day journey.

## Technologies Used

- Vite
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion

## How to Deploy to GitHub Pages

To deploy this project to your GitHub Pages:

1. **Install the deployment package**:
   ```sh
   npm install gh-pages --save-dev
   ```

2. **Add deployment scripts to package.json**:
   Add these lines under the `"scripts"` section:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. **Deploy the project**:
   ```sh
   npm run deploy
   ```

## Local Development

```sh
npm install
npm run dev
```
