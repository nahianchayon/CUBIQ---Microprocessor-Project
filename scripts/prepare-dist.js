import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");
const distClientDir = path.resolve(__dirname, "../dist/client");
const assetsDir = path.join(distClientDir, "assets");
const publicDir = path.resolve(__dirname, "../public");

if (!fs.existsSync(distClientDir)) {
  fs.mkdirSync(distClientDir, { recursive: true });
}

let mainJs = "";
let mainCss = "";

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  mainJs = files.find((f) => f.startsWith("index-") && f.endsWith(".js")) || "";
  mainCss = files.find((f) => f.startsWith("styles-") && f.endsWith(".css")) || "";
}

const htmlContent = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CUBIQ — Microprocessor Focus & Meeting Intelligence</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
    ${mainCss ? `<link rel="stylesheet" href="/assets/${mainCss}" />` : ""}
  </head>
  <body class="bg-background text-foreground antialiased">
    <div id="root"></div>
    ${mainJs ? `<script type="module" src="/assets/${mainJs}"></script>` : ""}
  </body>
</html>
`;

// Write index.html to dist/client/index.html AND dist/index.html
fs.writeFileSync(path.join(distClientDir, "index.html"), htmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, "index.html"), htmlContent, "utf-8");

// Copy favicons from public to dist/client and dist
if (fs.existsSync(publicDir)) {
  const favicons = ["favicon.svg", "favicon.ico", "robots.txt"];
  for (const f of favicons) {
    const srcFile = path.join(publicDir, f);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(distClientDir, f));
      fs.copyFileSync(srcFile, path.join(distDir, f));
    }
  }
}

console.log(`[prepare-dist] Successfully generated dist/client/index.html & dist/index.html (JS: ${mainJs}, CSS: ${mainCss})`);
