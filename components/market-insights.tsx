"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle, BarChart3, Info, ChevronDown, ChevronUp } from "lucide-react"
import { fetchMarketInsights } from "@/lib/market-api"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function MarketInsights() {
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showTrendInfo, setShowTrendInfo] = useState(false)

  const loadInsights = async () => {
    try {
      setIsLoading(true)
      const data = await fetchMarketInsights()
      setInsights(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch market insights:", err)
      setError("Failed to load market insights. Please try again later.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadInsights()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadInsights()
  }

  const getFearGreedColor = (value) => {
    if (value <= 25) return "bg-red-600 text-white"
    if (value <= 45) return "bg-orange-500 text-white"
    if (value <= 55) return "bg-yellow-500 text-slate-950"
    if (value <= 75) return "bg-green-500 text-white"
    return "bg-green-600 text-white"
  }

  const getLiquidityTrendIcon = (trend) => {
    switch (trend) {
      case "increasing_rapidly":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "increasing":
        return <TrendingUp className="h-5 w-5 text-green-400" />
      case "stable":
        return <BarChart3 className="h-5 w-5 text-yellow-500" />
      case "decreasing":
        return <TrendingDown className="h-5 w-5 text-orange-500" />
      case "decreasing_rapidly":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <BarChart3 className="h-5 w-5 text-gray-400" />
    }
  }

  const getLiquidityTrendText = (trend) => {
    switch (trend) {
      case "increasing_rapidly":
        return "Rapidly Increasing"
      case "increasing":
        return "Increasing"
      case "stable":
        return "Stable"
      case "decreasing":
        return "Decreasing"
      case "decreasing_rapidly":
        return "Rapidly Decreasing"
      default:
        return "Unknown"
    }
  }

  const getLiquidityTrendColor = (trend) => {
    switch (trend) {
      case "increasing_rapidly":
        return "text-green-500"
      case "increasing":
        return "text-green-400"
      case "stable":
        return "text-yellow-500"
      case "decreasing":
        return "text-orange-500"
      case "decreasing_rapidly":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  const getChangeColor = (value) => {
    if (value > 0) return "text-green-500"
    if (value < 0) return "text-red-500"
    return "text-yellow-500"
  }

  const getChangeIcon = (value) => {
    if (value > 0) return <ChevronUp className="h-4 w-4" />
    if (value < 0) return <ChevronDown className="h-4 w-4" />
    return null
  }

  if (isLoading) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-300">
            <p className="mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Try Again"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insights) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-300">
            <p className="mb-4">No market insights available at the moment.</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { fearAndGreed, m2MoneySupply, marketAdvice } = insights

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium text-gray-200">Market Insights</CardTitle>
        <Button onClick={handleRefresh} variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Fear & Greed Index */}
          <div className="bg-slate-850/70 rounded-lg p-5 backdrop-blur-sm border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-gray-200">Fear & Greed Index</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                      <span className="sr-only">About Fear & Greed Index</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      The Fear & Greed Index measures market sentiment from 0 (Extreme Fear) to 100 (Extreme Greed).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{fearAndGreed.current.value}</div>
                <Badge className={`${getFearGreedColor(fearAndGreed.current.value)} mt-2 px-3 py-1 font-medium`}>
                  {fearAndGreed.current.classification}
                </Badge>
              </div>
              <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-slow">
                <div
                  className={`w-20 h-20 rounded-full border-4 ${getFearGreedColor(
                    fearAndGreed.current.value,
                  )} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-xl font-bold">{fearAndGreed.current.value}</span>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div className="text-xs text-gray-400 mb-2">Last 7 Days</div>
              <div className="flex justify-between">
                {fearAndGreed.history
                  .slice()
                  .reverse()
                  .map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full ${getFearGreedColor(day.value)} flex items-center justify-center shadow-md`}
                      >
                        <span className="text-xs font-medium">{day.value}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(day.date * 1000).toLocaleDateString(undefined, { day: "numeric" })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* M2 Money Supply */}
          <div className="bg-slate-850/70 rounded-lg p-5 backdrop-blur-sm border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-gray-200">M2 Money Supply</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-400" />
                    <span className="sr-only">About M2 Money Supply</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">M2 Money Supply</h4>
                    <p className="text-sm text-gray-400">
                      M2 is a measure of the money supply that includes cash, checking deposits, and easily convertible
                      near money.
                    </p>
                    <h5 className="font-medium text-sm mt-2">Trend Definitions:</h5>
                    <ul className="text-xs space-y-1 text-gray-400">
                      {Object.entries(m2MoneySupply.trendDefinitions).map(([key, value]) => (
                        <li key={key} className="flex items-center gap-2">
                          <span className={`font-medium ${getLiquidityTrendColor(key)}`}>
                            {getLiquidityTrendText(key)}:
                          </span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${m2MoneySupply.current.value.toFixed(2)}T</div>
                <div className="flex items-center mt-2">
                  {getLiquidityTrendIcon(m2MoneySupply.trend)}
                  <span className={`ml-1 text-sm font-medium ${getLiquidityTrendColor(m2MoneySupply.trend)}`}>
                    {getLiquidityTrendText(m2MoneySupply.trend)}
                  </span>
                </div>
              </div>
              <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center shadow-lg animate-float">
                {getLiquidityTrendIcon(m2MoneySupply.trend)}
              </div>
            </div>

            {/* M2 Change Information */}
            <div className="mt-4 grid grid-cols-2 gap-3 bg-slate-800/30 p-3 rounded-lg">
              <div>
                <div className="text-xs text-gray-400">1 Month Change</div>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-base font-medium ${getChangeColor(Number.parseFloat(m2MoneySupply.monthlyChange.percent))}`}
                  >
                    {getChangeIcon(Number.parseFloat(m2MoneySupply.monthlyChange.percent))}
                    {m2MoneySupply.monthlyChange.percent}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {m2MoneySupply.monthlyChange.value > 0 ? "+" : ""}${m2MoneySupply.monthlyChange.value.toFixed(2)}T
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">6 Month Change</div>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-base font-medium ${getChangeColor(Number.parseFloat(m2MoneySupply.sixMonthChange.percent))}`}
                  >
                    {getChangeIcon(Number.parseFloat(m2MoneySupply.sixMonthChange.percent))}
                    {m2MoneySupply.sixMonthChange.percent}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {m2MoneySupply.sixMonthChange.value > 0 ? "+" : ""}${m2MoneySupply.sixMonthChange.value.toFixed(2)}T
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-2">6 Month Trend (Trillions USD)</div>
              <div className="h-16 flex items-end justify-between">
                {m2MoneySupply.history.map((month, index) => {
                  // Calculate relative height based on min/max values
                  const values = m2MoneySupply.history.map((m) => m.value)
                  const min = Math.min(...values) * 0.995 // Add a small buffer
                  const max = Math.max(...values) * 1.005
                  const range = max - min
                  const heightPercentage = range > 0 ? ((month.value - min) / range) * 100 : 50
                  const height = 10 + heightPercentage * 0.5 // Scale between 10% and 60%

                  return (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-7 bg-primary rounded-t shadow-glow"
                              style={{ height: `${height}px` }}
                            ></div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(month.date).toLocaleDateString(undefined, { month: "short" })}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">${month.value.toFixed(2)}T</p>
                          <p className="text-xs text-gray-400">
                            {new Date(month.date).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Market Advice */}
        <div className="bg-slate-850/70 rounded-lg p-5 backdrop-blur-sm border border-slate-700/50">
          <h3 className="text-base font-medium text-gray-200 mb-3">Market Analysis</h3>
          <p className="text-base text-gray-300 leading-relaxed">{marketAdvice}</p>
        </div>
      </CardContent>
    </Card>
  )
}
