// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/board/test');

  await page.getByRole("button").getByText("Clear").click();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('whiteboard-frontend');
});
