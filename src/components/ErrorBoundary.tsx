// ============================================================
// xml-gcamcon — ErrorBoundary Component
// Catches render errors + corrupted localStorage gracefully
// ============================================================

"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("[xml-gcamcon] ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    // Clear potentially corrupted localStorage
    try {
      localStorage.removeItem("gcamcon_configs");
      localStorage.removeItem("gcamcon_active");
      localStorage.removeItem("gcamcon_theme");
    } catch {
      // localStorage itself might be unavailable
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
          <div className="card max-w-md w-full p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-red-500/30">
              ⚠️
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">Something went wrong</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {this.state.error?.message || "An unexpected error occurred."}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 text-sm font-semibold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-lg border border-[var(--border)] transition-all"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 text-sm font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all"
              >
                Reset All Data
              </button>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              &quot;Reset All Data&quot; clears localStorage and reloads. Your saved configs will be lost.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
