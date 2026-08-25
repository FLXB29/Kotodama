import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve('dist')
const indexPath = resolve(dist, 'index.html')

if (!existsSync(indexPath)) throw new Error('Không tìm thấy dist/index.html. Hãy chạy Vite build trước.')

const indexHtml = readFileSync(indexPath, 'utf8')
if (indexHtml.includes('/src/main.tsx')) throw new Error('Production HTML vẫn tham chiếu entry source của Vite.')
if (!indexHtml.includes('/assets/')) throw new Error('Production HTML chưa tham chiếu asset đã hash.')

const assetsPath = resolve(dist, 'assets')
const assets = existsSync(assetsPath)
  ? readdirSync(assetsPath).filter((file) => statSync(resolve(assetsPath, file)).isFile())
  : []
if (assets.length === 0) throw new Error('Không tìm thấy asset production trong dist/assets.')

console.log(`Production artifact đã sẵn sàng: ${assets.length} assets được hash.`)
