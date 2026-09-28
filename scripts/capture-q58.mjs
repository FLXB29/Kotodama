import http from 'node:http'
import { createServer as createViteServer } from 'vite'
import { chromium } from 'playwright'

async function run() {
  const viteServer = await createViteServer({ server: { port: 5174, host: '127.0.0.1' } })
  await viteServer.listen()
  const localUrl = viteServer.resolvedUrls.local[0]

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } })

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

    // Scroll directly to question 58 element
    const q58El = page.locator('div:has-text("Mondai 4 Đọc hiểu - Mondai 1")').first()
    await q58El.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'tmp/browser_q58_passage_clean.png' })
    console.log('Saved to tmp/browser_q58_passage_clean.png')
  } finally {
    await browser.close()
    await viteServer.close()
  }
}

run()
