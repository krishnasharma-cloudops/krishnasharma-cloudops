# Krishna Sharma — DevOps Portfolio

Static portfolio optimized for GitHub Pages. No build step is required.

## Deploy on GitHub Pages
1. Create a GitHub repository (for example `portfolio`).
2. Upload all files from this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then save.
6. Open the Pages URL shown by GitHub after deployment.

The site uses only relative local paths for the resume/CSS/JS, so it also works when hosted under a project path such as `username.github.io/portfolio/`.

## Files
- `index.html` — main site
- `style.css` — layout, graphics and animations
- `script.js` — interaction, Three.js scene and motion
- `Krishna-Sharma-Resume.pdf` — resume shown in the modal
- `.nojekyll` — keeps GitHub Pages from applying Jekyll processing

## Notes
Three.js and Google Fonts are loaded from public CDNs, so those effects need an internet connection. The page itself remains static and GitHub Pages compatible.
