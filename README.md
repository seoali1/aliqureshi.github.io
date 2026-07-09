# Muhammad Ali Qureshi — Portfolio Site

A 4-page static site (Home, Projects, About, Contact). No build step, no backend — plain HTML/CSS/JS, so it deploys anywhere for free.

## Deploy for $0 with GitHub Pages

1. Create a GitHub account if you don't have one (free).
2. Create a new repository named exactly: `yourusername.github.io` (replace with your actual GitHub username).
3. Upload all files from this folder (`index.html`, `about.html`, `projects.html`, `contact.html`, `css/`, `js/`, `images/`) to the root of that repo.
4. Go to the repo's **Settings → Pages**, set the source branch to `main` and folder to `/ (root)`.
5. Wait 1–2 minutes. Your site is live at `https://yourusername.github.io`.

## Alternative: Netlify (drag-and-drop, also free)

1. Go to netlify.com and sign up free.
2. Drag this whole folder onto the "Deploy" area on your dashboard.
3. You'll get a free URL like `yourname.netlify.app` instantly. You can rename the subdomain in site settings.

## Editing later

- All text lives directly in the `.html` files — open in any text editor and edit.
- Colors, fonts, and spacing are controlled from `css/style.css` (see the `:root` variables at the top).
- To add a new project, copy an existing `.project-card` block in `projects.html` and edit the text/image.
- Add new project images to `images/projects/`.

## Custom domain later (still can be near $0)

If you eventually want a custom domain (e.g. `aliqureshi.com`) instead of the free subdomain, buy it from any registrar (~$10–12/year, sometimes $1 first-year promos) and point it at GitHub Pages or Netlify following their "custom domain" docs — no rebuild needed.
