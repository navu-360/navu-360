import * as Sentry from "@sentry/nextjs";
import Custom500 from "pages/500";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    // eslint-disable-next-line import/namespace
    Sentry.captureException(error, {
      extra: errorInfo,
    });
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI -- to be designed
      return <Custom500 />;
    }

    // Return children components in case of no error

    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}

export default ErrorBoundary;
