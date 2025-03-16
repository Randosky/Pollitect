import React, { Component, ErrorInfo } from "react";

interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Error occurred:", error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <div>{this.state.error?.message}</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
