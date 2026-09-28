import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'

async function testPdfRender() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } })
  const pdfPath = path.resolve('tmp/original-question-pdfs/n3-2025-12-question.pdf')

  if (!fs.existsSync(pdfPath)) {
    console.log('PDF does not exist:', pdfPath)
    await browser.close()
    return
  }

  const fileUrl = `file:///${pdfPath.replace(/\\/g, '/')}`
  console.log('Opening:', fileUrl)
  await page.goto(fileUrl, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'tmp/test_pdf_screenshot.png' })
  console.log('Screenshot saved to tmp/test_pdf_screenshot.png')
  await browser.close()
}

testPdfRender()
