import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <section className="status-page"><h1>Something went wrong</h1><p>Please reload the page to try again.</p><button type="button" onClick={() => window.location.reload()}>Reload page</button></section>;
    return this.props.children;
  }
}
