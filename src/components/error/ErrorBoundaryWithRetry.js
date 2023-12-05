import React from 'react';

// Taken from an example found here:
// https://relay.dev/docs/guided-tour/rendering/error-states/
//
class ErrorBoundaryWithRetry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {error: null};
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    return {error: error};
  }

  componentDidCatch(error, errorInfo) {
    // TODO: Log error to sentry
    console.log(error, errorInfo);
  }

  handleRetry() {
    if (this.props.onRetry) {
      this.props.onRetry();
    }

    this.setState({
      error: null,
    });
  }

  render() {
    const {error} = this.state;
    if (error) {
      const {fallback} = this.props;
      if (typeof fallback === 'function') {
        return fallback({error, retry: () => this.handleRetry()});
      } else {
        return fallback;
      }
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundaryWithRetry;
