# PyWorkshop — Lab Activity 2

Beginner **Python** tutorial site:

- **Frontend:** HTML, CSS, JavaScript
- **Backend (local):** Flask (`backend/app.py`) grades the quiz
- **Compiler:** embedded [OneCompiler](https://onecompiler.com/embed/python) on `playground.html`
- **Hosting:** Netlify (static publish of the repo root)

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home |
| `learn.html` | Python tutorial + quiz |
| `playground.html` | Online compiler |
| `deploy.html` | Netlify steps |

## Run locally (HTML + Python backend)

```bash
python -m pip install -r requirements.txt
python backend/app.py
```

Open [http://localhost:5000](http://localhost:5000). The status pill should say the Flask backend is online.

Without Flask you can still open the HTML files or serve them with:

```bash
python -m http.server 5000
```

## Deploy on Netlify

1. Create an account at [https://app.netlify.com](https://app.netlify.com) (GitHub login is easiest).
2. Log in and click **Add a new project**.
3. Choose **Import an existing project** → **GitHub**.
4. Authorize Netlify if prompted. Netlify does not store your GitHub access token on their servers. See [Git provider permissions](https://docs.netlify.com/configure-builds/repo-permissions-linking/).
5. Select this repository. Use branch `main` or `arena/01a0dcd5-lab-activity-2-deploying-a-web` if that is where the site lives.
6. Build settings:
   - **Build command:** leave empty (or the echo command in `netlify.toml`)
   - **Publish directory:** `.`
7. Click **Deploy site** and wait for the build.
8. Open the generated URL. Rename the site under **Site configuration → Change site name**.

`netlify.toml` already sets the publish directory to the project root.

## Note on Python vs Netlify

Netlify publishes static files. Flask will not run in production here. The frontend still works: lessons, compiler embed, and in-browser quiz scoring.
