const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const input = process.argv[2];
  const output = process.argv[3] || input.replace(/\.html$/, '.pdf');

  if (!input) {
    console.error('Usage: node html2pdf.js <input.html> [output.pdf]');
    process.exit(1);
  }

  const browser = await chromium.launch({
    executablePath: '/home/m4rv1n/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(input), { waitUntil: 'networkidle' });
  await page.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
  });

  await browser.close();
  console.log('PDF generated: ' + output);
})();
