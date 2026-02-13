import { test, expect } from "@playwright/test";

test("profiles page shows login prompt when signed out", async ({ page }) => {
  await page.goto("/profiles");
  await expect(page.getByText("ابتدا وارد شوید")).toBeVisible();
});
