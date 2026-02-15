import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Fixed: Extend Component explicitly to ensure generics work correctly for props and state
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 text-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-left overflow-auto max-h-32">
                <p className="text-xs font-mono text-red-500 break-words">{this.state.error.toString()}</p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors gap-2"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;