# Optional animated contribution snake

The main README already has a custom animated hero and a typing animation. The snake is optional; enable it only after its workflow successfully creates the images.

1. Upload `.github/workflows/snake.yml` to your GitHub profile repository (`krishnasharma-cloudops/krishnasharma-cloudops`).
2. Open that repository's **Actions** tab → **Generate contribution snake** → **Run workflow**.
3. Wait for a successful run. Check for an `output` branch containing both `.svg` files.
4. Paste this block near the bottom of `README.md` (for example, just before the final contact area):

```html
<div align="center">
  <h3>CONTRIBUTION STREAM</h3>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/krishnasharma-cloudops/krishnasharma-cloudops/output/github-contribution-grid-snake-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/krishnasharma-cloudops/krishnasharma-cloudops/output/github-contribution-grid-snake.svg" />
    <img alt="Animated GitHub contribution snake" src="https://raw.githubusercontent.com/krishnasharma-cloudops/krishnasharma-cloudops/output/github-contribution-grid-snake.svg" />
  </picture>
</div>
```

If publishing fails with `403`, inspect the repository's **Settings → Actions → General → Workflow permissions** and permit GitHub Actions to write to the repository if your account/organization allows it. The workflow also declares `contents: write`.

The snake will update daily; GitHub's image cache may delay visible changes. The banner's custom CSS animation respects reduced-motion preferences.
