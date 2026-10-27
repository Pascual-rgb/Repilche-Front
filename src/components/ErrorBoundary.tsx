import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';
import './styles/ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <div className="error-boundary-icon-wrapper">
              <FaExclamationTriangle className="error-boundary-icon" />
            </div>
            <h1 className="error-boundary-title">Ocurrió un error inesperado</h1>
            <p className="error-boundary-message">
              Tuvimos un problema al cargar esta sección. Podés intentar recargar la página o volver al inicio.
            </p>

            {this.state.error && (
              <div className="error-boundary-details">
                <span className="error-boundary-details-summary">Detalle técnico:</span>
                <pre className="error-boundary-details-code">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div className="error-boundary-actions">
              <button
                type="button"
                className="error-boundary-btn error-boundary-btn-primary"
                onClick={this.handleReload}
              >
                <FaRedo /> Recargar página
              </button>
              <button
                type="button"
                className="error-boundary-btn error-boundary-btn-secondary"
                onClick={this.handleReset}
              >
                <FaHome /> Volver al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
