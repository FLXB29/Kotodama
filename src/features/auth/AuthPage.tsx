import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { Button, Card, Field, Input, PageShell } from '../../components/ui'
import { useAuth } from './authContext'
import { getPageFromPath, type Page } from '../../types/app'

type AuthForm = { name?: string; email: string; password: string; confirmPassword?: string }

export default function AuthPage({
  mode,
  onNavigate,
}: {
  mode: 'login' | 'register'
  onNavigate: (page: Page) => void
}) {
  const isLogin = mode === 'login'
  const location = useLocation()
  const { signIn, signUp } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthForm>()
  const password = watch('password')
  const mutation = useMutation({
    mutationFn: async (values: AuthForm) =>
      isLogin
        ? signIn({ email: values.email, password: values.password })
        : signUp({ name: values.name ?? '', email: values.email, password: values.password }),
    onSuccess: () => {
      if (!isLogin) {
        onNavigate('verifyEmail')
        return
      }
      const from = typeof location.state?.from === 'string' ? getPageFromPath(location.state.from) : undefined
      onNavigate(from ?? 'profile')
    },
  })
  const sessionMessage = typeof location.state?.message === 'string' ? location.state.message : undefined
  return (
    <PageShell width="reading" className="auth-page">
      <Card padding="lg" className="auth-card">
        <p className="auth-card__eyebrow">KOTODAMA ACCOUNT</p>
        <h1>{isLogin ? 'Chào mừng trở lại' : 'Tạo hành trình của bạn'}</h1>
        <p className="auth-card__intro">
          {isLogin
            ? 'Đăng nhập để tiếp tục lộ trình học của bạn.'
            : 'Lưu tiến độ học và đồng bộ trải nghiệm trên các thiết bị.'}
        </p>
        {sessionMessage && (
          <div className="auth-card__notice" role="status">
            {sessionMessage}
          </div>
        )}
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          {!isLogin && (
            <Field label="Họ và tên" error={errors.name?.message}>
              <Input autoComplete="name" {...register('name', { required: 'Vui lòng nhập họ và tên.' })} />
            </Field>
          )}
          <Field label="Email" error={errors.email?.message}>
            <Input
              type="email"
              autoComplete="email"
              {...register('email', {
                required: 'Vui lòng nhập email.',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email chưa đúng định dạng.' },
              })}
            />
          </Field>
          <Field label="Mật khẩu" error={errors.password?.message}>
            <Input
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              {...register('password', {
                required: 'Vui lòng nhập mật khẩu.',
                minLength: { value: 8, message: 'Mật khẩu cần ít nhất 8 ký tự.' },
              })}
            />
          </Field>
          {!isLogin && (
            <Field label="Xác nhận mật khẩu" error={errors.confirmPassword?.message}>
              <Input
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  validate: (value) => value === password || 'Mật khẩu xác nhận không khớp.',
                })}
              />
            </Field>
          )}
          {mutation.isError && (
            <div className="auth-card__error" role="alert">
              {mutation.error.message}
            </div>
          )}
          <Button type="submit" fullWidth disabled={mutation.isPending}>
            {mutation.isPending ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
          </Button>
        </form>
        <div className="auth-card__switch">
          {isLogin && (
            <Button variant="ghost" onClick={() => onNavigate('forgotPassword')}>
              Quên mật khẩu?
            </Button>
          )}
          <Button variant="ghost" onClick={() => onNavigate(isLogin ? 'register' : 'login')}>
            {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
          </Button>
        </div>
      </Card>
    </PageShell>
  )
}
