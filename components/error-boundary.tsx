"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    // You can also log the error to an error reporting service here
    console.error("Error caught by boundary:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen crypto-gradient text-white flex flex-col justify-center items-center p-4">
          <Alert variant="destructive" className="max-w-2xl bg-red-900/50 border-red-800/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">
                {this.state.error?.message || "An unexpected error occurred. Please try again."}
              </p>
              {process.env.NODE_ENV === "development" && this.state.errorInfo && (
                <pre className="mt-4 p-4 bg-black/50 rounded-lg overflow-auto text-sm">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </AlertDescription>
          </Alert>
          <Button
            onClick={this.handleReset}
            variant="outline"
            className="mt-6 bg-white/10 hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
} 