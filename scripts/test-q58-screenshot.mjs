import http from 'node:http'
import { createServer as createViteServer } from 'vite'
import { chromium } from 'playwright'

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/health`, (res) => resolve(true))
    req.on('error', () => resolve(false))
    req.setTimeout(1000, () => {
      req.destroy()
      resolve(false)
    })
  })
}

async function run() {
  console.log('=== SCREENSHOTTING QUESTION 58 (MONDAI 1 DOKKAI) ===')

  let apiServerProcess = null
  const apiRunning = await checkPort(8787)
  if (!apiRunning) {
    const { server } = await import('../server/index.mjs')
    await new Promise((resolve) => server.listen(8787, '127.0.0.1', resolve))
    apiServerProcess = server
  }

  const viteServer = await createViteServer({
    server: { port: 5174, host: '127.0.0.1' },
  })
  await viteServer.listen()
  const localUrl = viteServer.resolvedUrls.local[0] || 'http://127.0.0.1:5174/'

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })

  try {
    await page.goto(`${localUrl}jlpt`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    await page.locator('text=Đề mô phỏng N3').first().click()
    await page.waitForTimeout(1000)

    await page.locator('text=Kỳ 2 — tháng 12').first().click()
    await page.waitForTimeout(1000)

    await page.locator('button:has-text("Thi toàn đề"), button:has-text("Học đáp án")').first().click()
    await page.waitForTimeout(1500)

    await page.locator('text=Ngữ pháp & Đọc hiểu').first().click()
    await page.waitForTimeout(1500)

    // Click on question 58 in the sidebar
    console.log('Clicking on Question 58...')
    await page.locator('button:text-is("58")').first().click()
    await page.waitForTimeout(1000)

    await page.screenshot({ path: 'tmp/browser_q58_curry_unwrapped.png' })
    console.log('Saved Question 58 screenshot to tmp/browser_q58_curry_unwrapped.png!')
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await browser.close()
    await viteServer.close()
    if (apiServerProcess) apiServerProcess.close()
    console.log('Done.')
  }
}

run()
