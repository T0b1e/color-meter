import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ColorMeter] Uncaught error:', error, info.componentStack)
  }

  private handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="error-boundary">
        <div className="error-boundary__card">
          <div className="error-boundary__icon">⚠</div>
          <h2 className="error-boundary__title">เกิดข้อผิดพลาด</h2>
          <p className="error-boundary__sub">Something went wrong</p>
          <pre className="error-boundary__message">{error.message}</pre>
          <button
            type="button"
            className="error-boundary__btn"
            onClick={this.handleReset}
          >
            ลองใหม่อีกครั้ง · Try again
          </button>
        </div>
      </div>
    )
  }
}
