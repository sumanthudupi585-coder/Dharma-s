import React from 'react';
import styled from 'styled-components';

const ErrorWrap = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #000 0%, #0a0a0a 50%, #000 100%);
  color: #d4af37;
  padding: 2rem;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  font-family: var(--font-display);
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  font-family: var(--font-primary);
`;

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Intentionally silent in production; hook logging service here if desired
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorWrap role="alert" aria-live="assertive">
          <div>
            <ErrorTitle>Threads of fate tangled</ErrorTitle>
            <ErrorText>The weave faltered in this moment. Please refresh to restore order.</ErrorText>
          </div>
        </ErrorWrap>
      );
    }
    return this.props.children;
  }
}
