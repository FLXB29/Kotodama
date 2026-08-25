import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportDiagnostic } from '../lib/observability'
import { Button, Card, PageShell } from './ui'

type Props = { children: ReactNode; resetKey: string; onGoHome: () => void }
type State = { hasError: boolean; diagnosticId: string | null; resetKey: string }

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, diagnosticId: null, resetKey: '' }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey === state.resetKey) return null
    return { hasError: false, diagnosticId: null, resetKey: props.resetKey }
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true, diagnosticId: null }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const diagnosticId = reportDiagnostic('render', error, {
      route: this.props.resetKey,
      componentStack: Boolean(info.componentStack),
    })
    this.setState({ diagnosticId })
  }

  private retry = () => this.setState({ hasError: false, diagnosticId: null })

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <PageShell width="reading" className="app-state-page">
        <Card padding="lg" className="app-error-boundary" role="alert">
          <span className="app-error-boundary__eyebrow">ĐÃ XẢY RA SỰ CỐ</span>
          <h1>Không thể hiển thị nội dung này</h1>
          <p>Phiên học của bạn vẫn được giữ trên thiết bị. Hãy thử tải lại phần nội dung hoặc trở về trang chủ.</p>
          {this.state.diagnosticId && <small>Mã chẩn đoán: {this.state.diagnosticId}</small>}
          <div className="app-error-boundary__actions">
            <Button onClick={this.retry}>Thử lại</Button>
            <Button variant="secondary" onClick={this.props.onGoHome}>
              Về trang chủ
            </Button>
          </div>
        </Card>
      </PageShell>
    )
  }
}
