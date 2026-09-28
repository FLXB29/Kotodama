import { createServer as createViteServer } from 'vite'
import { chromium } from 'playwright'

async function run() {
  const viteServer = await createViteServer({ server: { port: 5174, host: '127.0.0.1' } })
  await viteServer.listen()
  const localUrl = viteServer.resolvedUrls.local[0]

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })

  try {
    await page.goto(`${localUrl}jlpt`, { waitUntil: 'networkidle' })
    await page.locator('text=Đề mô phỏng N3').first().click()
    await page.waitForTimeout(500)
    await page.locator('text=Kỳ 2 — tháng 12').first().click()
    await page.waitForTimeout(500)
    await page.locator('button:has-text("Thi toàn đề"), button:has-text("Học đáp án")').first().click()
    await page.waitForTimeout(1000)
    await page.locator('text=Ngữ pháp & Đọc hiểu').first().click()
    await page.waitForTimeout(1000)

    // Passage 2 is the curry passage (Mondai 1 Q1)
    const curryPassage = page.locator('.jlpt-reading-passage').nth(1)
    await curryPassage.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'tmp/browser_curry_unwrapped_proof.png' })
    console.log('Saved to tmp/browser_curry_unwrapped_proof.png')
  } finally {
    await browser.close()
    await viteServer.close()
  }
}

run()
