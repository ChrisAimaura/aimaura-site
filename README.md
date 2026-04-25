# Aimaura — Marketing Website

Marketing site for **Aimaura**, the dual ergonomic gaming mouse-controller. Pure static site (HTML / CSS / vanilla JS), built to deploy to **Azure Static Web Apps** from GitHub.

## What's in the box

```
.
├── index.html
├── styles.css
├── script.js
├── staticwebapp.config.json        # Azure SWA routes, headers, caching
├── .github/workflows/
│   └── azure-static-web-apps.yml   # CI/CD to Azure SWA
└── assets/
    ├── img/                        # Logos, hero, gallery (compressed)
    └── video/                      # Hero teaser video
```

No build step, no framework, no `node_modules`. Open `index.html` in a browser to preview locally, or run any static server (`npx serve .` / `python -m http.server`).

## Deploying to Azure Static Web Apps via GitHub

1. **Create a GitHub repo** and push these files to the `main` branch.
2. In the **Azure Portal**, create a new **Static Web App**:
   - Source: **GitHub** — authorise and select the repo + `main` branch.
   - Build presets: **Custom**.
   - App location: `/`
   - API location: *(leave blank)*
   - Output location: *(leave blank)*
3. Azure will commit a workflow file to your repo on first creation. **Replace it** with the one in this repo at `.github/workflows/azure-static-web-apps.yml` (it sets `skip_app_build: true` because the site is already static).
4. Azure injects a deployment secret named `AZURE_STATIC_WEB_APPS_API_TOKEN` into your repo automatically — the workflow consumes it.
5. Push to `main` → Site deploys. PRs get preview environments automatically.

### Custom domain
Add `aimaura.co.uk` (or `www.aimaura.co.uk`) in the SWA portal under **Custom domains** and follow the DNS validation steps.

## Editing the site

- **Copy & sections** — `index.html`. Each section is clearly commented.
- **Colours, type, spacing** — top of `styles.css` (CSS custom properties).
- **Behaviour (nav, reveals, video)** — `script.js`.
- **Headers / caching / routes** — `staticwebapp.config.json`.
- **Replacing assets** — drop new files into `assets/img/` or `assets/video/` and update the references in `index.html`.

## Notes on credits

- Patent pending — UK IPO and WIPO. Referenced in the hero badge row, the dedicated **Patent** section, and the footer.
- Contact: [enquiries@aimaura.co.uk](mailto:enquiries@aimaura.co.uk).
