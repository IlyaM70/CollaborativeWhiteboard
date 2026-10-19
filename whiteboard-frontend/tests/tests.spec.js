import { test, expect } from '@playwright/test';

// Test case to verify that a stroke can be drawn on the canvas
test('TC-01', async ({ page }) => {
  await page.goto('http://localhost:5173/board/test');
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();

  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 100);
  await page.mouse.up();

  await page.mouse.move(box.x + 200, box.y + 200);
  await page.mouse.down();
  await page.mouse.move(box.x + 300, box.y + 300);
  await page.mouse.up();

  const hasDrawing = await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");

  const imageData = context.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
      if (
          pixels[i] !== 255 ||
          pixels[i + 1] !== 255 ||
          pixels[i + 2] !== 255
      ) {
          return true;
      }
  }

  return false;
  
});

expect(hasDrawing).toBe(true);

});

// Test case to verify that multiple strokes can be drawn with different colors
test('TC-02', async ({ page }) => {  
  await page.goto('http://localhost:5173/board/test');

  const colorPicker = page.locator('input[type="color"]');
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();

  // Draw red stroke in the upper-left area
  await colorPicker.fill('#ff0000');

  await page.mouse.move(box.x + 20, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + 120);
  await page.mouse.up();

  // Draw blue stroke in a separate area
  await colorPicker.fill('#0000ff');

  await page.mouse.move(box.x + 200, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 300, box.y + 120);
  await page.mouse.up();

  // Verify red pixels in the red stroke's region
  const hasRedStroke = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");

    const imageData = context.getImageData(
      0,
      0,
      150,
      150
    );

    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      if (
        pixels[i] === 255 &&
        pixels[i + 1] === 0 &&
        pixels[i + 2] === 0
      ) {
        return true;
      }
    }

    return false;
  });

  expect(hasRedStroke).toBe(true);

  // Verify blue pixels in the blue stroke's region
  const hasBlueStroke = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");

    const imageData = context.getImageData(
      180,
      0,
      150,
      150
    );

    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      if (
        pixels[i] === 0 &&
        pixels[i + 1] === 0 &&
        pixels[i + 2] === 255
      ) {
        return true;
      }
    }

    return false;
  });

  expect(hasBlueStroke).toBe(true);
});

 // TC-03: Strokes use the selected thickness
test('TC-03: Thickness slider accepts different values', async ({ page }) => {
  await page.goto('http://localhost:5173/board/test');

  const thicknessSlider = page.locator('input[type="range"]');

  await thicknessSlider.fill('2');
  await expect(thicknessSlider).toHaveValue('2');

  await thicknessSlider.fill('10');
  await expect(thicknessSlider).toHaveValue('10');
});

