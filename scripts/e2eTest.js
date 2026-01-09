const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  const base = 'http://localhost:3000/';
  console.log('Opening', base);
  await page.goto(base, { waitUntil: 'networkidle2' });

  // Click the Record New Entry button (has + in text)
  const [recordBtn] = await page.$x("//button[contains(., '+')]");
  if (!recordBtn) {
    console.error('Record button not found');
    await browser.close();
    process.exit(1);
  }
  await recordBtn.click();
  await page.waitForSelector('form');

  // Fill name
  await page.type('input[name="name"]', 'Automated Mythic Brew');

  // Set category to Custom via select change
  await page.evaluate(() => {
    const sel = document.querySelector('select[name="category"]');
    if (sel) {
      sel.value = 'Custom';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Fill the custom category input (has mt-2 class)
  await page.waitForSelector('input.mt-2');
  await page.type('input.mt-2', 'Mythic Soda');

  // Fill a description
  await page.type('textarea[name="description"]', 'A fizzy potion that tastes of stars.');

  // Submit
  await page.click('button[type="submit"]');

  // Wait a moment for storage update
  await page.waitForTimeout(500);

  // Read localStorage recipes
  const recipes = await page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('alchemist_grimoire_recipes') || '[]');
    } catch (e) { return [] }
  });

  const found = recipes.find(r => r.name === 'Automated Mythic Brew');
  if (!found) {
    console.error('Saved recipe not found in localStorage');
    await browser.close();
    process.exit(2);
  }

  console.log('Found recipe:', { name: found.name, category: found.category });

  // Now toggle language to Vietnamese via header buttons (EN / VI)
  const [viBtn] = await page.$x("//button[contains(., 'VI')]");
  if (!viBtn) {
    console.error('VI button not found');
    await browser.close();
    process.exit(3);
  }
  await viBtn.click();
  await page.waitForTimeout(300);

  // Check translation: search placeholder should be Vietnamese
  const placeholder = await page.$eval('input[placeholder]', el => (el as HTMLInputElement).placeholder);
  console.log('Search placeholder after VI:', placeholder);

  await browser.close();
  // exit with success
  process.exit(0);
})();
