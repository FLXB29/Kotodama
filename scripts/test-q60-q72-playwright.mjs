import { chromium } from 'playwright'

async function run() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } })

  console.log('Navigating to http://localhost:5173/jlpt...')
  await page.goto('http://localhost:5173/jlpt', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  // Click "Đề mô phỏng N3"
  console.log('Clicking "Đề mô phỏng N3"...')
  await page.locator('text=Đề mô phỏng N3').first().click()
  await page.waitForTimeout(1500)

  // Click "Kỳ 2 — tháng 12" under 2025
  console.log('Clicking "Kỳ 2 — tháng 12"...')
  await page.locator('text=Kỳ 2 — tháng 12').first().click()
  await page.waitForTimeout(1500)

  // Click "Thi toàn đề" or "Học đáp án"
  console.log('Entering exam...')
  await page.locator('button:has-text("Thi toàn đề"), button:has-text("Học đáp án")').first().click()
  await page.waitForTimeout(2000)

  // Switch to Tab 2: "Ngữ pháp & Đọc hiểu"
  console.log('Switching to Tab 2: "Ngữ pháp & Đọc hiểu"...')
  await page.locator('text=Ngữ pháp & Đọc hiểu').first().click()
  await page.waitForTimeout(2000)

  // Find all passages in DOM
  const passages = await page.$$eval('.jlpt-reading-passage', (els) =>
    els.map((el) => {
      const img = el.querySelector('img')
      return {
        text: el.innerText.slice(0, 150).replace(/\n/g, ' '),
        hasImg: Boolean(img),
        imgSrc: img ? img.getAttribute('src') : null,
      }
    })
  )

  console.log(`\n=== RESULTS: Found ${passages.length} reading passages in Tab 2! ===`)
  passages.forEach((p, idx) => {
    console.log(`Passage #${idx + 1}: [hasImg: ${p.hasImg}] ${p.text}...`)
  })

  // Scroll to Q60 (Hotel room info)
  console.log('\nLooking for Q60 (Hotel room info)...')
  const q60Card = page.locator('text=和洋室のお部屋の情報').first()
  if (await q60Card.count() > 0) {
    await q60Card.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'tmp/browser_q60_proof.png' })
    console.log('Saved Q60 screenshot to tmp/browser_q60_proof.png!')
  }

  // Scroll to Mondai 4 (Flyer notice image)
  console.log('\nLooking for Mondai 4 (Flyer notice image)...')
  const m4Img = page.locator('.jlpt-reading-passage img').first()
  if (await m4Img.count() > 0) {
    await m4Img.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'tmp/browser_m4_proof.png' })
    console.log('Saved Mondai 4 screenshot to tmp/browser_m4_proof.png!')
  }

  await browser.close()
  console.log('\nAll done!')
}

run().catch(console.error)
