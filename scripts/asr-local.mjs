import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'

const defaultWindowsPython = 'C:\\Users\\ACER\\AppData\\Local\\Programs\\Python\\Python312\\python.exe'
const python =
  process.env.PYTHON_BIN ||
  (process.platform === 'win32' && existsSync(defaultWindowsPython)
    ? defaultWindowsPython
    : process.platform === 'win32'
      ? 'python'
      : 'python3')
const port = process.env.LOCAL_ASR_PORT || '8788'
const child = spawn(
  python,
  ['-m', 'uvicorn', 'asr_service:app', '--app-dir', 'server', '--host', '127.0.0.1', '--port', port],
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    windowsHide: false,
  }
)

child.once('error', (error) => {
  console.error(`Không thể khởi động Local ASR bằng ${python}: ${error.message}`)
  process.exitCode = 1
})
child.once('exit', (code) => {
  process.exitCode = code ?? 1
})
