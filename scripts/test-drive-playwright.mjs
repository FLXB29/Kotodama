import { chromium } from 'playwright'
import fs from 'node:fs'

async function run() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  try {
    console.log('Navigating to Google Drive folder...')
    await page.goto('https://drive.google.com/drive/u/0/folders/1Bexi9iK-m0aSgyPYBiAVwCmuh7aRVmUr', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    console.log('Page Title:', await page.title())
    const title = await page.title()
    await page.screenshot({ path: 'tmp/drive_screenshot.png' })
    console.log('Saved screenshot to tmp/drive_screenshot.png')

    // Find all folder or file names
    const textContent = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div[data-target="item"], [role="row"], [data-id]'))
      return elements.map((el) => el.innerText || el.getAttribute('aria-label') || '').filter(Boolean)
    })
    console.log(`Found ${textContent.length} item elements:`)
    console.log(textContent.slice(0, 15))
  } catch (err) {
    console.error('Playwright drive error:', err)
  } finally {
    await browser.close()
  }
}

run()
