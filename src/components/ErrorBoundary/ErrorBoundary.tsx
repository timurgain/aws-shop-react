import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _: React.ErrorInfo): void {
    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>Error</h1>
          <p>{this.state.error?.message} || An error occurred</p>
        </>
      );
    }
    return this.props.children;
  }
}
