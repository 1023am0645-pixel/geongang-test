import { readFile, writeFile } from "node:fs/promises";
import { extname } from "node:path";

const root = new URL("../", import.meta.url);
const assetPaths = [
  "assets/geoni-front.jpeg",
  "assets/gangi-front.jpeg",
  "assets/deongi-front.jpeg",
  "assets/gyuni-front.jpeg",
];

const cssAssetPaths = ["assets/fonts/KyoboHandwriting2019.otf"];

function mimeType(path) {
  const ext = extname(path).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".otf") return "font/otf";
  return "application/octet-stream";
}

let html = await readFile(new URL("index.html", root), "utf8");
let css = await readFile(new URL("styles.css", root), "utf8");
let js = await readFile(new URL("script.js", root), "utf8");

for (const path of assetPaths) {
  const data = await readFile(new URL(path, root));
  const uri = `data:${mimeType(path)};base64,${data.toString("base64")}`;
  js = js.replaceAll(path, uri);
}

for (const path of cssAssetPaths) {
  const data = await readFile(new URL(path, root));
  const uri = `data:${mimeType(path)};base64,${data.toString("base64")}`;
  css = css.replaceAll(path, uri);
}

html = html
  .replace('<html lang="ko">', '<html lang="ko" data-offline-bundle="true">')
  .replace('    <link rel="manifest" href="manifest.webmanifest" />\n', "")
  .replace('    <link rel="apple-touch-icon" href="assets/geoni-front.jpeg" />\n', "")
  .replace('<link rel="stylesheet" href="styles.css" />', `<style>\n${css}\n</style>`)
  .replace('<script src="script.js"></script>', `<script>\n${js}\n</script>`);

await writeFile(new URL("offline.html", root), html);
