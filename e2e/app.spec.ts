import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Tabularize/);
});

test("not found", async ({ page }) => {
  await page.goto("/lost");

  await expect(page).toHaveTitle(/Tabularize/);

  await expect(
    page.getByRole("alert", {
      name: /page not found/i,
    }),
  ).toBeInViewport();
});
