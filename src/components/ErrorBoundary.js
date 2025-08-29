import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Could log to a service here
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'grid', placeItems: 'center',
          background: 'linear-gradient(135deg, #000 0%, #0a0a0a 50%, #000 100%)',
          color: '#d4af37', padding: '2rem', textAlign: 'center'
        }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>A veil has fallen</h1>
            <p style={{ fontFamily: 'var(--font-primary)' }}>An error disrupted this scene. Try refreshing or returning to the title.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
