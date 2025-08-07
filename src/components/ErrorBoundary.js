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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo || { componentStack: 'No component stack available' }
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'Poppins, Arial, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: 32,
            maxWidth: 600
          }}>
            <h2>⚠️ Something went wrong!</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <details style={{ marginTop: 16, textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', marginBottom: 8 }}>Error Details</summary>
              <pre style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: 16, 
                borderRadius: 8, 
                fontSize: 12,
                overflow: 'auto',
                maxHeight: 200
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#fff',
                color: '#7b2ff2',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                marginTop: 16,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
