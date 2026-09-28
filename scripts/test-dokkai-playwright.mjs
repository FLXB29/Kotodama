import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs'
import { createServer as createViteServer } from 'vite'
import { chromium } from 'playwright'

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/health`, (res) => {
      resolve(true)
    })
    req.on('error', () => resolve(false))
    req.setTimeout(1000, () => {
      req.destroy()
      resolve(false)
    })
  })
}

async function run() {
  console.log('=== RUNNING TARGETED PLAYWRIGHT TEST ON 12/2025 (TAB 2: DOKKAI) ===')

  let apiServerProcess = null
  const apiRunning = await checkPort(8787)
  if (!apiRunning) {
    console.log('Starting backend API server...')
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
  const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } })

  try {
    await page.goto(`${localUrl}jlpt`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    // Click "Đề mô phỏng N3"
    await page.locator('text=Đề mô phỏng N3').first().click()
    await page.waitForTimeout(1500)

    // Click "Kỳ 2 — tháng 12" under 2025
    await page.locator('text=Kỳ 2 — tháng 12').first().click()
    await page.waitForTimeout(1500)

    // Click "Thi toàn đề" or "Học đáp án"
    await page.locator('button:has-text("Thi toàn đề"), button:has-text("Học đáp án")').first().click()
    await page.waitForTimeout(2000)

    // Switch to Tab 2: "Ngữ pháp & Đọc hiểu"
    console.log('Clicking Tab 2: "Ngữ pháp & Đọc hiểu"...')
    await page.locator('text=Ngữ pháp & Đọc hiểu').first().click()
    await page.waitForTimeout(2000)

    await page.screenshot({ path: 'tmp/browser_dokkai_view.png' })
    console.log('Saved Dokkai section screenshot to tmp/browser_dokkai_view.png')

    // Find all passages in DOM
    const passages = await page.$$eval('.jlpt-reading-passage', (els) =>
      els.map((el) => {
        const img = el.querySelector('img')
        return {
          text: el.innerText,
          html: el.innerHTML,
          hasImg: Boolean(img),
          imgSrc: img ? img.getAttribute('src') : null,
          imgComplete: img ? img.complete : null,
          imgNaturalWidth: img ? img.naturalWidth : null,
          badBrCount: (el.innerHTML.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]<br\s*\/?>[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/g) || []).length,
        }
      })
    )

    console.log(`\n=== RESULTS: Found ${passages.length} reading passages in Tab 2! ===`)
    for (let i = 0; i < passages.length; i++) {
      const p = passages[i]
      console.log(`Passage #${i + 1}:`)
      console.log(`  Snippet: ${p.text.slice(0, 100).replace(/\n/g, ' ')}...`)
      console.log(`  Bad linebreaks: ${p.badBrCount}`)
      console.log(`  Has Image: ${p.hasImg} (Src: ${p.imgSrc}, naturalWidth: ${p.imgNaturalWidth})`)
    }

    // Scroll to Mondai 1 (First passage)
    const p1 = page.locator('.jlpt-reading-passage').first()
    if (await p1.isVisible()) {
      console.log('Scrolling to Mondai 1 passage...')
      await p1.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000)
      await page.screenshot({ path: 'tmp/browser_m1_unwrapped.png' })
      console.log('Saved Mondai 1 visual screenshot to tmp/browser_m1_unwrapped.png!')
    }

    // Scroll to Mondai 4 (Passage with image)
    const imgLocator = page.locator('.jlpt-reading-passage img').first()
    if (await imgLocator.isVisible()) {
      console.log('Scrolling to Mondai 4 notice image...')
      await imgLocator.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1500)
      await page.screenshot({ path: 'tmp/browser_m4_image.png' })
      console.log('Saved Mondai 4 visual screenshot to tmp/browser_m4_image.png!')
    }
  } catch (err) {
    console.error('Error in Playwright test:', err)
  } finally {
    await browser.close()
    await viteServer.close()
    if (apiServerProcess) apiServerProcess.close()
    console.log('Done test.')
  }
}

run()
