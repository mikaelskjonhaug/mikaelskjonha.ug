import assert from "node:assert/strict";
import test from "node:test";
import { after } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let vite;

async function loadModule(path) {
  vite ??= await createServer({ server: { middlewareMode: true, ws: false }, appType: "custom" });
  return vite.ssrLoadModule(path);
}

after(async () => {
  await vite?.close();
});

test("getPageFromHash accepts known hashes and defaults empty or invalid hashes to hero", async () => {
  const { getPageFromHash } = await loadModule("/src/App.jsx");

  assert.equal(getPageFromHash("#work"), "work");
  assert.equal(getPageFromHash("#"), "hero");
  assert.equal(getPageFromHash(""), "hero");
  assert.equal(getPageFromHash("#missing"), "hero");
});

test("MobileTabBar renders labeled tabs with the active page selected", async () => {
  const { default: MobileTabBar } = await loadModule("/src/components/mobile-tab-bar.jsx");
  const markup = renderToStaticMarkup(createElement(MobileTabBar, { activePage: "work", onNavigate() {} }));

  assert.match(markup, /role="tablist" aria-label="Pages"/);
  assert.equal((markup.match(/role="tab"/g) ?? []).length, 5);
  for (const label of ["Blog", "Work", "Projects", "Skills", "Guestbook"]) {
    assert.match(markup, new RegExp(`aria-label="${label}"`));
  }
  assert.match(markup, /aria-selected="true" aria-label="Work"/);
  assert.match(markup, /aria-selected="false" aria-label="Blog"/);
});

test("navigation selection skips the current page and returns a different valid page", async () => {
  const { getNavigationPage } = await loadModule("/src/App.jsx");

  assert.equal(getNavigationPage("work", "work"), null);
  assert.equal(getNavigationPage("work", "projects"), "projects");
  assert.equal(getNavigationPage("hero", "not-a-page"), null);
});

// Browser history events need a DOM harness, which this project does not install.
// The pure decision above drives App's history/state update and keeps this regression executable in Node.
