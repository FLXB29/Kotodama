import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Button, Card, Field, Input, PageShell } from '../../components/ui'
import { apiPaths, getApiErrorMessage, requestApi } from '../../lib/apiClient'
import { useAuth } from '../auth/authContext'
import type { Page } from '../../types/app'

type PasswordValues = { currentPassword: string; password: string; confirmPassword: string }

export default function AccountSecurityPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { status, user, acceptSession } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordValues>()
  const password = watch('password')
  const changePassword = useMutation({
    mutationFn: (values: PasswordValues) =>
      requestApi<unknown>({
        method: 'POST',
        url: apiPaths.auth.changePassword,
        data: { currentPassword: values.currentPassword, password: values.password },
      }),
    onSuccess: (session) => {
      acceptSession(session)
      reset()
    },
  })
  const resendVerification = useMutation({
    mutationFn: () =>
      requestApi<void>({ method: 'POST', url: apiPaths.auth.resendVerification, data: { email: user?.email } }),
  })

  if (status !== 'authenticated' || !user)
    return (
      <PageShell width="reading" className="auth-page">
        <Card padding="lg" className="auth-card">
          <p className="auth-card__eyebrow">BẢO MẬT TÀI KHOẢN</p>
          <h1>Đăng nhập để tiếp tục</h1>
          <p className="auth-card__intro">
            Đổi mật khẩu và quản lý xác minh email chỉ dành cho tài khoản đã đăng nhập.
          </p>
          <Button fullWidth onClick={() => onNavigate('login')}>
            Đăng nhập
          </Button>
        </Card>
      </PageShell>
    )

  return (
    <PageShell width="reading" className="auth-page">
      <Card padding="lg" className="auth-card">
        <p className="auth-card__eyebrow">BẢO MẬT TÀI KHOẢN</p>
        <h1>Bảo vệ tài khoản</h1>
        <p className="auth-card__intro">Quản lý mật khẩu và xác minh email cho {user.email}.</p>
        <section className="account-security-status">
          <div>
            <strong>Email</strong>
            <p>{user.emailVerified ? 'Đã xác minh' : 'Chưa xác minh'}</p>
          </div>
          {user.emailVerified ? (
            <span className="account-security-status__ok">Đã xác minh</span>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              disabled={resendVerification.isPending}
              onClick={() => resendVerification.mutate()}
            >
              {resendVerification.isPending ? 'Đang gửi…' : 'Gửi lại email'}
            </Button>
          )}
        </section>
        {resendVerification.isSuccess && (
          <p className="auth-card__success" role="status">
            Nếu email này được liên kết với tài khoản, liên kết xác minh đã được gửi.
          </p>
        )}
        <hr className="account-security-divider" />
        <h2>Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit((values) => changePassword.mutate(values))}>
          <Field label="Mật khẩu hiện tại" error={errors.currentPassword?.message}>
            <Input
              type="password"
              autoComplete="current-password"
              {...register('currentPassword', { required: 'Vui lòng nhập mật khẩu hiện tại.' })}
            />
          </Field>
          <Field label="Mật khẩu mới" error={errors.password?.message}>
            <Input
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: 'Vui lòng nhập mật khẩu mới.',
                minLength: { value: 8, message: 'Mật khẩu cần ít nhất 8 ký tự.' },
              })}
            />
          </Field>
          <Field label="Xác nhận mật khẩu mới" error={errors.confirmPassword?.message}>
            <Input
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword', {
                validate: (value) => value === password || 'Mật khẩu xác nhận không khớp.',
              })}
            />
          </Field>
          {changePassword.isError && (
            <p className="auth-card__error" role="alert">
              {getApiErrorMessage(changePassword.error, changePassword.error.message)}
            </p>
          )}
          {changePassword.isSuccess && (
            <p className="auth-card__success" role="status">
              Mật khẩu đã được cập nhật.
            </p>
          )}
          <Button type="submit" fullWidth disabled={changePassword.isPending}>
            {changePassword.isPending ? 'Đang cập nhật…' : 'Lưu mật khẩu mới'}
          </Button>
        </form>
      </Card>
    </PageShell>
  )
}
