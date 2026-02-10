"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      console.log('Error would be sent to monitoring service');
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Oops! Algo deu errado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {process.env.NODE_ENV === 'development' 
                  ? this.state.error?.message 
                  : 'Ocorreu um erro inesperado. Por favor, tente novamente.'
                }
              </p>
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} variant="default">
                  Tentar novamente
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Recarregar página
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    Detalhes do erro (dev)
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
