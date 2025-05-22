"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, RefreshCw, LineChart, Loader2, AlertCircle } from "lucide-react"
import { PredictionChart } from "@/components/prediction-chart"
import { Badge } from "@/components/ui/badge"

export function LstmPrediction() {
  const [cryptoOptions, setCryptoOptions] = useState([])
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")
  const [days, setDays] = useState(60)
  const [predictionDays, setPredictionDays] = useState(7)
  const [lookbackWindow, setLookbackWindow] = useState(14)
  const [trainingProgress, setTrainingProgress] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [error, setError] = useState(null)
  const [historicalData, setHistoricalData] = useState([])
  const [predictions, setPredictions] = useState(null)
  const [modelMetrics, setModelMetrics] = useState(null)
  const [modelSummary, setModelSummary] = useState(null)

  // Fetch available cryptocurrencies on component mount
  useEffect(() => {
    async function fetchCryptoOptions() {
      try {
        setIsFetchingData(true)
        const response = await fetch("/api/ml/crypto-options")
        const data = await response.json()
        setCryptoOptions(data)
      } catch (err) {
        console.error("Failed to fetch crypto options:", err)
        setError("Failed to load cryptocurrency options.")
      } finally {
        setIsFetchingData(false)
      }
    }

    fetchCryptoOptions()
  }, [])

  // Fetch historical data for the selected cryptocurrency
  const fetchHistoricalData = async () => {
    if (!selectedCrypto) return

    try {
      setIsFetchingData(true)
      setError(null)
      setHistoricalData([])
      setPredictions(null)
      setModelMetrics(null)

      const response = await fetch(`/api/ml/historical-data?coin=${selectedCrypto}&days=${days}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch historical data")
      }

      const data = await response.json()
      setHistoricalData(data)
    } catch (err) {
      console.error("Failed to fetch historical data:", err)
      setError(`Failed to fetch historical data: ${err.message}`)
    } finally {
      setIsFetchingData(false)
    }
  }

  // Train the model and make predictions
  const trainAndPredict = async () => {
    try {
      setIsTraining(true)
      setError(null)
      setPredictions(null)
      setModelMetrics(null)

      const response = await fetch("/api/ml/train-predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coin: selectedCrypto,
          data: historicalData,
          lookbackWindow,
          predictionDays,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Model training failed")
      }

      const result = await response.json()
      setPredictions(result.predictions)
      setModelMetrics(result.metrics)
      setModelSummary(result.modelSummary)
    } catch (err) {
      console.error("Model training error:", err)
      setError(`Model training error: ${err.message}`)
    } finally {
      setIsTraining(false)
      setTrainingProgress(null)
    }
  }

  // Reset everything
  const handleReset = () => {
    setPredictions(null)
    setModelMetrics(null)
    setTrainingProgress(null)
    setError(null)
  }

  // Event handler for SSE training progress updates
  useEffect(() => {
    if (isTraining) {
      const eventSource = new EventSource(`/api/ml/training-progress?coin=${selectedCrypto}`)

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setTrainingProgress(data)
      }

      eventSource.onerror = () => {
        eventSource.close()
      }

      return () => {
        eventSource.close()
      }
    }
  }, [isTraining, selectedCrypto])

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <CardTitle className="text-xl font-medium text-gray-200 flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              LSTM Price Prediction
              <Badge variant="outline" className="ml-2 bg-primary/20 text-primary border-primary/30">
                AI
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Time series forecasting with Long Short-Term Memory neural networks
            </CardDescription>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-slate-800/50 border-slate-700/50">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="font-medium mb-1">About LSTM Neural Networks</p>
                <p className="text-sm">
                  Long Short-Term Memory (LSTM) networks are a type of recurrent neural network specialized in learning
                  patterns over sequences. They excel at time series forecasting by maintaining memory of past values
                  and detecting temporal patterns.
                </p>
                <p className="text-sm mt-2">
                  <strong>Note:</strong> While LSTM models can identify patterns in price data, cryptocurrency markets
                  are influenced by many external factors. Use these predictions as one of many tools in your analysis.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="bg-red-900/50 border-red-800/50 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Configuration Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="crypto-select" className="text-gray-300 mb-2 block">
              Cryptocurrency
            </Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto} disabled={isTraining || isFetchingData}>
              <SelectTrigger id="crypto-select" className="bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {cryptoOptions.length > 0 ? (
                  cryptoOptions.map((crypto) => (
                    <SelectItem key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol.toUpperCase()})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading" disabled>
                    Loading options...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="days-input" className="text-gray-300 mb-2 block">
              Historical Days
            </Label>
            <Input
              id="days-input"
              type="number"
              value={days}
              onChange={(e) => setDays(Number.parseInt(e.target.value) || 30)}
              min="30"
              max="365"
              className="bg-slate-800/50 border-slate-700/50 text-white"
              disabled={isTraining || isFetchingData}
            />
          </div>

          <div>
            <Label htmlFor="prediction-days-input" className="text-gray-300 mb-2 block">
              Prediction Days
            </Label>
            <Input
              id="prediction-days-input"
              type="number"
              value={predictionDays}
              onChange={(e) => setPredictionDays(Number.parseInt(e.target.value) || 7)}
              min="1"
              max="30"
              className="bg-slate-800/50 border-slate-700/50 text-white"
              disabled={isTraining || isFetchingData}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="lookback-window-input" className="text-gray-300 mb-2 block flex items-center">
              Lookback Window
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">
                      The number of previous days the model will use to predict the next value. Higher values may
                      capture more complex patterns but require more data.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="lookback-window-input"
              type="number"
              value={lookbackWindow}
              onChange={(e) => setLookbackWindow(Number.parseInt(e.target.value) || 7)}
              min="5"
              max="30"
              className="bg-slate-800/50 border-slate-700/50 text-white"
              disabled={isTraining || isFetchingData}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-2">
            <Button
              className="flex-1 mb-2 sm:mb-0"
              variant="outline"
              onClick={fetchHistoricalData}
              disabled={!selectedCrypto || isTraining || isFetchingData}
            >
              {isFetchingData ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading Data
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Fetch Data
                </>
              )}
            </Button>

            <Button
              className="flex-1 mb-2 sm:mb-0"
              onClick={trainAndPredict}
              disabled={!historicalData.length || isTraining || isFetchingData}
            >
              {isTraining ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Training...
                </>
              ) : (
                "Train & Predict"
              )}
            </Button>

            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={isTraining || isFetchingData || (!predictions && !modelMetrics && !error)}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Training Progress */}
        {isTraining && trainingProgress && (
          <div className="bg-slate-800/50 rounded-md p-3">
            <div className="text-sm text-gray-300 mb-2">
              Training in progress
              <span className="ml-1 text-primary">
                (Epoch {trainingProgress.epoch}/{trainingProgress.totalEpochs})
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(trainingProgress.epoch / trainingProgress.totalEpochs) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-400 flex justify-between">
              <div>Loss: {trainingProgress.loss.toFixed(4)}</div>
              <div>Accuracy: {(trainingProgress.accuracy * 100).toFixed(2)}%</div>
            </div>
          </div>
        )}

        {/* Chart Area */}
        <div className="mt-6 space-y-4">
          {isFetchingData ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full bg-slate-800/60" />
              <Skeleton className="h-[300px] w-full bg-slate-800/60" />
            </div>
          ) : !historicalData.length ? (
            <div className="text-center py-8 text-gray-400 bg-slate-800/30 rounded-lg">
              <LineChart className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <p>Select a cryptocurrency and fetch historical data to begin</p>
            </div>
          ) : (
            <PredictionChart
              historicalData={historicalData}
              predictions={predictions}
              isLoading={isTraining}
              predictionDays={predictionDays}
            />
          )}
        </div>

        {/* Model Performance Metrics */}
        {modelMetrics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/30 p-4 rounded-lg">
            <div>
              <div className="text-sm text-gray-400">Mean Absolute Error (MAE)</div>
              <div className="text-xl font-medium">${modelMetrics.mae.toFixed(2)}</div>
              <div className="text-xs text-gray-500">
                Average absolute difference between predicted and actual values
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Root Mean Square Error (RMSE)</div>
              <div className="text-xl font-medium">${modelMetrics.rmse.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Square root of the average squared differences</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">R² Score</div>
              <div className="text-xl font-medium">{modelMetrics.r2.toFixed(3)}</div>
              <div className="text-xs text-gray-500">
                Proportion of variance explained by the model (higher is better)
              </div>
            </div>
          </div>
        )}

        {/* Model Summary */}
        {modelSummary && (
          <div className="bg-slate-800/30 p-4 rounded-lg">
            <h4 className="text-sm text-gray-300 mb-2 font-medium">Model Architecture</h4>
            <div className="text-xs text-gray-400 font-mono whitespace-pre-wrap">{modelSummary}</div>
          </div>
        )}

        {/* Disclaimer */}
        <Alert className="bg-yellow-900/20 border-yellow-800/50 mb-5 text-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            This is an educational model only. Cryptocurrency prices are affected by many external factors that cannot
            be predicted by historical price data alone. Never make investment decisions based solely on these
            predictions.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
