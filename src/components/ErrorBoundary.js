// src/components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 ERROR BOUNDARY CAPTUROU ERRO:');
    console.error('❌ Erro:', error);
    console.error('📍 Local:', errorInfo);
    console.error('🔍 Stack:', error.stack);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          backgroundColor: '#fecaca',
          border: '2px solid #ef4444',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px',
          fontFamily: 'monospace'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>
            🚨 Erro Capturado!
          </h2>
          
          <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
            <strong>Mensagem:</strong>
            <pre style={{ color: '#dc2626', fontSize: '14px', margin: '8px 0' }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
            <strong>Local do Erro:</strong>
            <pre style={{ fontSize: '12px', margin: '8px 0', maxHeight: '200px', overflow: 'auto' }}>
              {this.state.errorInfo.componentStack}
            </pre>
          </div>

          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;