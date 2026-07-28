import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Pokeda gallery", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="he">/i);
  assert.match(html, /<title>פוקדע<\/title>/i);
  assert.match(
    html,
    /<meta name="description" content="Friendly Pokedex"\/?>/i,
  );
  assert.match(html, /<main class="app type-bg--electric" dir="rtl">/i);
  assert.match(html, /<h1>פוקדע<\/h1>/);
  assert.match(html, /placeholder="חיפוש לפי שם\.\.\."/);
  assert.match(html, /class="pokemon-grid"/);
  assert.match(html, /class="infinite-scroll-sentinel"/);
  assert.match(html, /טוענים עוד פוקימונים\.\.\./);
  assert.equal(
    (html.match(/\bclass="pokemon-tile\b/g) ?? []).length,
    60,
    "the initial server render should contain one gallery batch",
  );
  assert.doesNotMatch(
    html,
    /codex-preview|react-loading-skeleton|Your site is taking shape/i,
  );
});

test("keeps infinite scrolling wired to the gallery", async () => {
  const [page, css, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const pokemonBatchSize = 60;/);
  assert.match(page, /new IntersectionObserver/);
  assert.match(page, /root:\s*grid,/);
  assert.match(page, /setVisibleCount\(start \+ count\)/);
  assert.match(page, /ref=\{pokemonGridEndRef\}/);
  assert.match(page, /className="infinite-scroll-sentinel"/);
  assert.doesNotMatch(page, /moreLoaded|load-more-feedback/);

  assert.match(
    css,
    /\.pokemon-grid\s*\{[^}]*overflow-y:\s*auto;/s,
  );
  assert.match(css, /\.infinite-scroll-sentinel\s*\{/);
  assert.doesNotMatch(css, /\.load-more-feedback\s*\{/);

  assert.match(layout, /title:\s*"פוקדע"/);
  assert.match(layout, /<html lang="he">/);
});
