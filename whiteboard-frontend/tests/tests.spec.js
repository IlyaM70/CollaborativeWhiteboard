import { test, expect } from '@playwright/test';

// TC-01: Test case to verify that a stroke can be drawn on the canvas
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
      if (pixels[i + 3] > 0) {
          return true;
      }
  }

  return false;
  
});

expect(hasDrawing).toBe(true);

});

// TC-02: Test case to verify that multiple strokes can be drawn with different colors
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
test('TC-03', async ({ page }) => {
  await page.goto('http://localhost:5173/board/test');

  const thicknessSlider = page.locator('input[type="range"]');

  await thicknessSlider.fill('2');
  await expect(thicknessSlider).toHaveValue('2');

  await thicknessSlider.fill('10');
  await expect(thicknessSlider).toHaveValue('10');
});

// TC-04: Multiple users can draw in the same room
test('TC-04 ', async ({ browser }) => {
  const pageA = await browser.newPage();
  const pageB = await browser.newPage();

  await pageA.goto('http://localhost:5173/board/test');
  await pageB.goto('http://localhost:5173/board/test');

  const canvasA = pageA.locator('canvas');
  const boxA = await canvasA.boundingBox();

  // User A draws a stroke
  await pageA.mouse.move(boxA.x + 50, boxA.y + 50);
  await pageA.mouse.down();
  await pageA.mouse.move(boxA.x + 150, boxA.y + 150);
  await pageA.mouse.up();

  // Wait for a moment to ensure the stroke is synchronized
  await pageB.waitForTimeout(1000);

  // Verify that User B sees the stroke drawn by User A
  const hasDrawingB = await pageB.evaluate(() => {
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
      if (pixels[i + 3] > 0) {
        return true;
      }
    }

    return false;
  });

  expect(hasDrawingB).toBe(true);


  //user B draws a stroke
  const canvasB = pageB.locator('canvas');
  const boxB = await canvasB.boundingBox();

  await pageB.mouse.move(boxB.x + 200, boxB.y + 50);
  await pageB.mouse.down();
  await pageB.mouse.move(boxB.x + 300, boxB.y + 150);
  await pageB.mouse.up();

  // Wait for a moment to ensure the stroke is synchronized
  await pageA.waitForTimeout(1000);

  // Verify that User A sees the stroke drawn by User B
  const hasDrawingA = await pageA.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");

    const imageData = context.getImageData(
      200,
      50,
      120,
      120
    );

    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 0) {
        return true;
      }
    }

    return false;
  });

  expect(hasDrawingA).toBe(true);

});

 // TC-05: Drawings are isolated between rooms
test('TC-05', async ({ browser }) => {
  const pageA = await browser.newPage();
  const pageB = await browser.newPage();

  // Open different rooms
  await pageA.goto('http://localhost:5173/board/test1');
  await pageB.goto('http://localhost:5173/board/test2');

  // User A draws in room test1
  const canvasA = pageA.locator('canvas');
  const boxA = await canvasA.boundingBox();

  await pageA.mouse.move(boxA.x + 50, boxA.y + 50);
  await pageA.mouse.down();
  await pageA.mouse.move(boxA.x + 150, boxA.y + 150);
  await pageA.mouse.up();

  // Allow time for synchronization
  await pageB.waitForTimeout(1000);

  // Check whether User B received the stroke in the same region
  const hasDrawingB = await pageB.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const image = ctx.getImageData(40, 40, 120, 120);
    const pixels = image.data;

    // Ignore transparent pixels; only detect visible pixels
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 0) {
        return true;
      }
    }

    return false;
  });

  // User B should not see User A's stroke
  expect(hasDrawingB).toBe(false);

  await pageA.close();
  await pageB.close();
});


// TC-06: User can clear their canvas
test('TC-06', async ({ page }) => {
  await page.goto('http://localhost:5173/board/test');

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();

  // Draw a stroke
  await page.mouse.move(box.x + 50, box.y + 50);
  await page.mouse.down();
  await page.mouse.move(box.x + 150, box.y + 150);
  await page.mouse.up();

  // Click the clear button
  const clearButton = page.locator('button:has-text("Clear")');
  await clearButton.click();

  // Verify that the canvas is cleared
  const isCanvasCleared = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 0) {
        return false; // Found a non-transparent pixel
      }
    }

    return true; // All pixels are transparent
  });

  expect(isCanvasCleared).toBe(true);
});


//TC-07: Clear is synchronized within a room
test('TC-07', async ({ browser }) => {
  const pageA = await browser.newPage();
  const pageB = await browser.newPage();

  // Open the same room
  await pageA.goto('http://localhost:5173/board/test');
  await pageB.goto('http://localhost:5173/board/test');

  // User A draws a stroke
  const canvasA = pageA.locator('canvas');
  const boxA = await canvasA.boundingBox();

  await pageA.mouse.move(boxA.x + 50, boxA.y + 50);
  await pageA.mouse.down();
  await pageA.mouse.move(boxA.x + 150, boxA.y + 150);
  await pageA.mouse.up();

  // Click the clear button in User A's view
  const clearButton = pageA.locator('button:has-text("Clear")');
  await clearButton.click();

  // Allow time for synchronization
  await pageB.waitForTimeout(1000);

  // Verify that User B's canvas is also cleared
  const isCanvasClearedB = await pageB.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 0) {
        return false; // Found a non-transparent pixel
      }
    }

    return true; // All pixels are transparent
  });

  expect(isCanvasClearedB).toBe(true);

  await pageA.close();
  await pageB.close();
});