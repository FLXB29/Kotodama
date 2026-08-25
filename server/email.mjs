import nodemailer from 'nodemailer'

function oneTimeLink(appOrigin, path, token) {
  const url = new URL(path, appOrigin)
  url.searchParams.set('token', token)
  return url.toString()
}

function plainMessage(title, body, link) {
  return `${title}\n\n${body}\n\n${link}\n\nNếu bạn không yêu cầu thao tác này, bạn có thể bỏ qua email.`
}

export function createEmailService(config) {
  if (!config.smtp.enabled) {
    return {
      enabled: false,
      async sendVerificationEmail() {
        return { delivered: false }
      },
      async sendPasswordResetEmail() {
        return { delivered: false }
      },
    }
  }

  const transport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.password } : undefined,
  })

  async function send({ to, subject, text }) {
    await transport.sendMail({ from: config.smtp.from, to, subject, text })
    return { delivered: true }
  }

  return {
    enabled: true,
    async verifyConnection() {
      await transport.verify()
    },
    async sendVerificationEmail(user, token) {
      const link = oneTimeLink(config.appOrigin, '/xac-minh-email', token)
      return send({
        to: user.email,
        subject: 'Xác minh email Kotodama',
        text: plainMessage('Xác minh email Kotodama', 'Mở liên kết sau để xác minh địa chỉ email của bạn:', link),
      })
    },
    async sendPasswordResetEmail(user, token) {
      const link = oneTimeLink(config.appOrigin, '/dat-lai-mat-khau', token)
      return send({
        to: user.email,
        subject: 'Đặt lại mật khẩu Kotodama',
        text: plainMessage('Đặt lại mật khẩu Kotodama', 'Mở liên kết sau để đặt lại mật khẩu của bạn:', link),
      })
    },
  }
}
