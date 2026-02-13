import { test, expect } from "@playwright/test";

test("admin page requires login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
});
