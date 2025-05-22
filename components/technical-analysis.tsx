"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Info,
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  BarChart4,
  Activity,
  LineChart,
  HelpCircle,
} from "lucide-react"
import { fetchTechnicalAnalysis } from "@/lib/technical-api"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TechnicalAnalysis() {
  const [technicalData, setTechnicalData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState([])

  const loadTechnicalData = async () => {
    try {
      setIsLoading(true)
      const data = await fetchTechnicalAnalysis()
      setTechnicalData(data)
      setFilteredData(data.data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch technical analysis:", err)
      setError("Failed to load technical analysis. Please try again later.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadTechnicalData()
  }, [])

  useEffect(() => {
    if (technicalData && technicalData.data) {
      if (searchTerm) {
        const filtered = technicalData.data.filter(
          (crypto) =>
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredData(filtered)
      } else {
        setFilteredData(technicalData.data)
      }
    }
  }, [searchTerm, technicalData])

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadTechnicalData()
  }

  const getOutlookColor = (outlook) => {
    switch (outlook) {
      case "bullish":
        return "text-green-500"
      case "bearish":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const getOutlookBadgeColor = (outlook, strength) => {
    if (outlook === "bullish") {
      return strength === "strong" ? "bg-green-600 text-white" : "bg-green-500/20 text-green-400 border-green-500/30"
    } else if (outlook === "bearish") {
      return strength === "strong" ? "bg-red-600 text-white" : "bg-red-500/20 text-red-400 border-red-500/30"
    } else {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  const getOutlookIcon = (outlook) => {
    switch (outlook) {
      case "bullish":
        return <TrendingUp className="h-4 w-4" />
      case "bearish":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getRSIColor = (value) => {
    if (value >= 70) return "text-red-500"
    if (value <= 30) return "text-green-500"
    return "text-yellow-500"
  }

  const getMACDColor = (trend) => {
    switch (trend) {
      case "bullish":
        return "text-green-500"
      case "bearish":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const formatPrice = (price) => {
    if (price >= 1000) {
      return price.toLocaleString()
    } else if (price >= 1) {
      return price.toFixed(2)
    } else {
      // For very small prices (e.g., SHIB, DOGE)
      return price.toFixed(6)
    }
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

  if (!technicalData || !technicalData.data) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-300">
            <p className="mb-4">No technical analysis data available at the moment.</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-medium text-gray-200 flex items-center">
            <BarChart4 className="mr-2 h-5 w-5 text-primary" />
            Technical Analysis
          </CardTitle>
          <CardDescription className="text-gray-400">
            RSI, MACD, and support/resistance levels for top cryptocurrencies
          </CardDescription>
        </div>
        <Button onClick={handleRefresh} variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <Alert className="bg-slate-800/50 border-slate-700/50 mb-5 text-gray-300">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Technical analysis should be used alongside fundamental analysis and market sentiment for best results.
          </AlertDescription>
        </Alert>

        <div className="mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              className="pl-10 bg-slate-800/50 border-slate-700/50 text-white h-11 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="summary">
          <TabsList className="grid grid-cols-2 mb-5 bg-slate-850/70">
            <TabsTrigger value="summary" className="text-sm">
              <Activity className="h-4 w-4 mr-2" /> Summary View
            </TabsTrigger>
            <TabsTrigger value="detailed" className="text-sm">
              <LineChart className="h-4 w-4 mr-2" /> Detailed Analysis
            </TabsTrigger>
          </TabsList>

          {/* Summary View */}
          <TabsContent value="summary">
            <div className="space-y-4">
              {filteredData.length > 0 ? (
                filteredData.map((crypto) => (
                  <Card key={crypto.id} className="bg-slate-850/70 border-slate-700/50 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden mr-3">
                            <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold">{crypto.name}</h3>
                              <span className="text-gray-400 text-xs ml-1">({crypto.symbol.toUpperCase()})</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="text-gray-400">
                                ${formatPrice(crypto.currentPrice)} / £{formatPrice(crypto.gbpPrice)}
                              </span>
                              <span
                                className={`ml-2 ${
                                  crypto.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                                } flex items-center`}
                              >
                                {crypto.priceChange24h >= 0 ? (
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                {Math.abs(crypto.priceChange24h).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <Badge
                          className={getOutlookBadgeColor(
                            crypto.technicalIndicators.technicalOutlook.outlook,
                            crypto.technicalIndicators.technicalOutlook.strength,
                          )}
                        >
                          {getOutlookIcon(crypto.technicalIndicators.technicalOutlook.outlook)}
                          <span className="ml-1 capitalize">
                            {crypto.technicalIndicators.technicalOutlook.strength === "strong" ? "Strong " : ""}
                            {crypto.technicalIndicators.technicalOutlook.outlook}
                          </span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="bg-slate-800/30 p-2 rounded-md">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>RSI</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                    <HelpCircle className="h-3 w-3 text-gray-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="font-medium">Relative Strength Index (RSI)</p>
                                  <p className="text-sm mt-1">
                                    RSI is a momentum oscillator that measures the speed and magnitude of price
                                    movements on a scale of 0-100.
                                  </p>
                                  <ul className="text-sm mt-2 space-y-1">
                                    <li>
                                      <span className="text-red-400 font-medium">Above 70:</span> Considered overbought
                                      - potential reversal or correction may occur
                                    </li>
                                    <li>
                                      <span className="text-yellow-400 font-medium">Between 30-70:</span> Neutral
                                      territory - price may continue in the current trend
                                    </li>
                                    <li>
                                      <span className="text-green-400 font-medium">Below 30:</span> Considered oversold
                                      - potential reversal or bounce may occur
                                    </li>
                                  </ul>
                                  <p className="text-sm mt-2 text-gray-400">
                                    Traders often use RSI to identify potential reversal points or divergences between
                                    price and momentum.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={getRSIColor(crypto.technicalIndicators.rsi.value)}>
                              {Math.round(crypto.technicalIndicators.rsi.value)}
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                crypto.technicalIndicators.rsi.status === "overbought"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : crypto.technicalIndicators.rsi.status === "oversold"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              }
                            >
                              {crypto.technicalIndicators.rsi.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="bg-slate-800/30 p-2 rounded-md">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>MACD</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                    <HelpCircle className="h-3 w-3 text-gray-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="font-medium">Moving Average Convergence Divergence (MACD)</p>
                                  <p className="text-sm mt-1">
                                    MACD is a trend-following momentum indicator that shows the relationship between two
                                    moving averages of an asset's price.
                                  </p>
                                  <ul className="text-sm mt-2 space-y-1">
                                    <li>
                                      <span className="text-green-400 font-medium">MACD {">"} 0:</span> Bullish -
                                      short-term momentum is stronger than long-term
                                    </li>
                                    <li>
                                      <span className="text-red-400 font-medium">MACD {"<"} 0:</span> Bearish -
                                      short-term momentum is weaker than long-term
                                    </li>
                                    <li>
                                      <span className="text-blue-400 font-medium">Crossovers:</span> When MACD crosses
                                      above/below signal line, may indicate trend changes
                                    </li>
                                  </ul>
                                  <p className="text-sm mt-2 text-gray-400">
                                    MACD consists of the MACD line (faster), signal line (slower), and histogram
                                    (difference between the two).
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={getMACDColor(crypto.technicalIndicators.macd.trend)}>
                              {crypto.technicalIndicators.macd.value > 0 ? "+" : ""}
                              {crypto.technicalIndicators.macd.value}
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                crypto.technicalIndicators.macd.trend === "bullish"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : crypto.technicalIndicators.macd.trend === "bearish"
                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              }
                            >
                              {crypto.technicalIndicators.macd.trend}
                            </Badge>
                          </div>
                        </div>

                        <div className="bg-slate-800/30 p-2 rounded-md">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>Nearest Level</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                    <HelpCircle className="h-3 w-3 text-gray-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="font-medium">Support & Resistance Levels</p>
                                  <p className="text-sm">
                                    Support levels are price points where a downtrend can pause due to buying interest.
                                    Resistance levels are price points where an uptrend can pause due to selling
                                    pressure. These levels are key for determining potential reversal points.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>
                              ${formatPrice(crypto.technicalIndicators.supportResistance.nearestLevel)} / £
                              {formatPrice(crypto.technicalIndicators.supportResistance.nearestLevelGBP)}
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                crypto.technicalIndicators.supportResistance.nearestType.includes("support")
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                            >
                              {crypto.technicalIndicators.supportResistance.nearestType}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-300 bg-slate-800/20 p-3 rounded-md">
                        <p>{crypto.technicalIndicators.technicalOutlook.prediction}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-300 bg-slate-850/50 rounded-lg p-6">
                  No cryptocurrencies found matching your search.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Detailed Analysis */}
          <TabsContent value="detailed">
            <div className="space-y-4">
              {filteredData.length > 0 ? (
                filteredData.map((crypto) => (
                  <Accordion key={crypto.id} type="single" collapsible className="bg-slate-850/70 rounded-lg">
                    <AccordionItem value={crypto.id} className="border-b-0">
                      <AccordionTrigger className="px-4 py-3 hover:bg-slate-800/30 rounded-t-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden mr-3">
                            <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-6 h-6" />
                          </div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{crypto.name}</h3>
                            <span className="text-gray-400 text-xs ml-1">({crypto.symbol.toUpperCase()})</span>
                          </div>
                          <Badge
                            className={`ml-3 ${getOutlookBadgeColor(
                              crypto.technicalIndicators.technicalOutlook.outlook,
                              crypto.technicalIndicators.technicalOutlook.strength,
                            )}`}
                          >
                            {getOutlookIcon(crypto.technicalIndicators.technicalOutlook.outlook)}
                            <span className="ml-1 capitalize">
                              {crypto.technicalIndicators.technicalOutlook.strength === "strong" ? "Strong " : ""}
                              {crypto.technicalIndicators.technicalOutlook.outlook}
                            </span>
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          {/* RSI Analysis */}
                          <div className="bg-slate-800/30 p-3 rounded-md">
                            <h4 className="font-medium mb-2 flex items-center">
                              <Activity className="h-4 w-4 mr-2 text-primary" />
                              Relative Strength Index (RSI)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                                      <HelpCircle className="h-3 w-3 text-gray-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="font-medium">Relative Strength Index (RSI)</p>
                                    <p className="text-sm mt-1">
                                      RSI is a momentum oscillator that measures the speed and magnitude of price
                                      movements on a scale of 0-100.
                                    </p>
                                    <ul className="text-sm mt-2 space-y-1">
                                      <li>
                                        <span className="text-red-400 font-medium">Above 70:</span> Considered
                                        overbought - potential reversal or correction may occur
                                      </li>
                                      <li>
                                        <span className="text-yellow-400 font-medium">Between 30-70:</span> Neutral
                                        territory - price may continue in the current trend
                                      </li>
                                      <li>
                                        <span className="text-green-400 font-medium">Below 30:</span> Considered
                                        oversold - potential reversal or bounce may occur
                                      </li>
                                    </ul>
                                    <p className="text-sm mt-2 text-gray-400">
                                      Traders often use RSI to identify potential reversal points or divergences between
                                      price and momentum.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </h4>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-green-500">Oversold</span>
                                <span className="text-yellow-500">Neutral</span>
                                <span className="text-red-500">Overbought</span>
                              </div>
                              <div className="h-2 bg-slate-700 rounded-full overflow-hidden relative">
                                {/* RSI scale markers */}
                                <div className="absolute top-0 left-[30%] h-full w-px bg-gray-500"></div>
                                <div className="absolute top-0 left-[70%] h-full w-px bg-gray-500"></div>
                                {/* RSI value indicator */}
                                <div
                                  className="absolute top-0 h-full w-1 bg-white rounded-full"
                                  style={{ left: `${crypto.technicalIndicators.rsi.value}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium">
                                  Current Value:{" "}
                                  <span className={getRSIColor(crypto.technicalIndicators.rsi.value)}>
                                    {Math.round(crypto.technicalIndicators.rsi.value)}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                  Status:{" "}
                                  <span
                                    className={
                                      crypto.technicalIndicators.rsi.status === "overbought"
                                        ? "text-red-500"
                                        : crypto.technicalIndicators.rsi.status === "oversold"
                                          ? "text-green-500"
                                          : "text-yellow-500"
                                    }
                                  >
                                    {crypto.technicalIndicators.rsi.status}
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-300 max-w-xs text-right">
                                {crypto.technicalIndicators.rsi.description}
                              </div>
                            </div>
                          </div>

                          {/* MACD Analysis */}
                          <div className="bg-slate-800/30 p-3 rounded-md">
                            <h4 className="font-medium mb-2 flex items-center">
                              <LineChart className="h-4 w-4 mr-2 text-primary" />
                              Moving Average Convergence Divergence (MACD)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                                      <HelpCircle className="h-3 w-3 text-gray-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="font-medium">Moving Average Convergence Divergence (MACD)</p>
                                    <p className="text-sm mt-1">
                                      MACD is a trend-following momentum indicator that shows the relationship between
                                      two moving averages of an asset's price.
                                    </p>
                                    <ul className="text-sm mt-2 space-y-1">
                                      <li>
                                        <span className="text-green-400 font-medium">MACD {">"} 0:</span> Bullish -
                                        short-term momentum is stronger than long-term
                                      </li>
                                      <li>
                                        <span className="text-red-400 font-medium">MACD {"<"} 0:</span> Bearish -
                                        short-term momentum is weaker than long-term
                                      </li>
                                      <li>
                                        <span className="text-blue-400 font-medium">Crossovers:</span> When MACD crosses
                                        above/below signal line, may indicate trend changes
                                      </li>
                                    </ul>
                                    <p className="text-sm mt-2 text-gray-400">
                                      MACD consists of the MACD line (faster), signal line (slower), and histogram
                                      (difference between the two).
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </h4>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <div className="text-sm text-gray-400 mb-1">MACD Line</div>
                                <div className="text-base font-medium">
                                  <span className={getMACDColor(crypto.technicalIndicators.macd.trend)}>
                                    {crypto.technicalIndicators.macd.value > 0 ? "+" : ""}
                                    {crypto.technicalIndicators.macd.value}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-400 mb-1">Signal Line</div>
                                <div className="text-base font-medium">
                                  {crypto.technicalIndicators.macd.signal > 0 ? "+" : ""}
                                  {crypto.technicalIndicators.macd.signal}
                                </div>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="text-sm text-gray-400 mb-1">Histogram</div>
                              <div className="h-8 bg-slate-700 rounded-md overflow-hidden flex items-center justify-center relative">
                                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                                  <div className="h-px w-full bg-gray-500"></div>
                                </div>
                                <div
                                  className={`h-4 ${
                                    crypto.technicalIndicators.macd.histogram > 0 ? "bg-green-500" : "bg-red-500"
                                  } rounded-sm`}
                                  style={{
                                    width: `${Math.min(
                                      80,
                                      Math.abs(crypto.technicalIndicators.macd.histogram) * 100,
                                    )}%`,
                                    marginLeft: crypto.technicalIndicators.macd.histogram < 0 ? "auto" : "0",
                                    marginRight: crypto.technicalIndicators.macd.histogram > 0 ? "auto" : "0",
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium">
                                  Trend:{" "}
                                  <span className={getMACDColor(crypto.technicalIndicators.macd.trend)}>
                                    {crypto.technicalIndicators.macd.trend}
                                  </span>
                                </div>
                                {crypto.technicalIndicators.macd.crossover !== "none" && (
                                  <div className="text-sm text-gray-400 mt-1">
                                    Recent Crossover:{" "}
                                    <span
                                      className={
                                        crypto.technicalIndicators.macd.crossover === "bullish"
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }
                                    >
                                      {crypto.technicalIndicators.macd.crossover}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-gray-300 max-w-xs text-right">
                                {crypto.technicalIndicators.macd.description}
                              </div>
                            </div>
                          </div>

                          {/* Support & Resistance */}
                          <div className="bg-slate-800/30 p-3 rounded-md">
                            <h4 className="font-medium mb-3 flex items-center">
                              <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                              Support & Resistance Levels
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                                      <HelpCircle className="h-3 w-3 text-gray-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>
                                      Support levels are price points where a downtrend can pause due to buying
                                      interest. Resistance levels are price points where an uptrend can pause due to
                                      selling pressure. These levels are key for determining potential reversal points.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </h4>
                            <div className="relative h-24 mb-3">
                              {/* Price scale visualization */}
                              <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between">
                                {/* Resistance 2 */}
                                <div className="flex items-center">
                                  <div className="h-px flex-grow bg-red-500/50 mr-2"></div>
                                  <div className="text-xs text-red-400">
                                    R2: ${formatPrice(crypto.technicalIndicators.supportResistance.resistance2)} / £
                                    {formatPrice(crypto.technicalIndicators.supportResistance.resistance2GBP)}
                                  </div>
                                </div>
                                {/* Resistance 1 */}
                                <div className="flex items-center">
                                  <div className="h-px flex-grow bg-red-500/70 mr-2"></div>
                                  <div className="text-xs text-red-400">
                                    R1: ${formatPrice(crypto.technicalIndicators.supportResistance.resistance1)} / £
                                    {formatPrice(crypto.technicalIndicators.supportResistance.resistance1GBP)}
                                  </div>
                                </div>
                                {/* Current Price */}
                                <div className="flex items-center">
                                  <div className="h-px flex-grow bg-primary mr-2"></div>
                                  <div className="text-xs font-medium text-primary">
                                    Current: ${formatPrice(crypto.currentPrice)} / £{formatPrice(crypto.gbpPrice)}
                                  </div>
                                </div>
                                {/* Support 1 */}
                                <div className="flex items-center">
                                  <div className="h-px flex-grow bg-green-500/70 mr-2"></div>
                                  <div className="text-xs text-green-400">
                                    S1: ${formatPrice(crypto.technicalIndicators.supportResistance.support1)} / £
                                    {formatPrice(crypto.technicalIndicators.supportResistance.support1GBP)}
                                  </div>
                                </div>
                                {/* Support 2 */}
                                <div className="flex items-center">
                                  <div className="h-px flex-grow bg-green-500/50 mr-2"></div>
                                  <div className="text-xs text-green-400">
                                    S2: ${formatPrice(crypto.technicalIndicators.supportResistance.support2)} / £
                                    {formatPrice(crypto.technicalIndicators.supportResistance.support2GBP)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-300">
                              <span className="font-medium">Nearest level:</span>{" "}
                              <span
                                className={
                                  crypto.technicalIndicators.supportResistance.nearestType.includes("support")
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                              >
                                {crypto.technicalIndicators.supportResistance.nearestType} at $
                                {formatPrice(crypto.technicalIndicators.supportResistance.nearestLevel)} / £
                                {formatPrice(crypto.technicalIndicators.supportResistance.nearestLevelGBP)}
                              </span>
                            </div>
                          </div>

                          {/* Technical Outlook & Prediction */}
                          <div
                            className={`p-3 rounded-md ${
                              crypto.technicalIndicators.technicalOutlook.outlook === "bullish"
                                ? "bg-green-900/20 border border-green-800/30"
                                : crypto.technicalIndicators.technicalOutlook.outlook === "bearish"
                                  ? "bg-red-900/20 border border-red-800/30"
                                  : "bg-yellow-900/20 border border-yellow-800/30"
                            }`}
                          >
                            <h4
                              className={`font-medium mb-2 ${getOutlookColor(
                                crypto.technicalIndicators.technicalOutlook.outlook,
                              )}`}
                            >
                              Technical Outlook:{" "}
                              <span className="capitalize">
                                {crypto.technicalIndicators.technicalOutlook.strength === "strong" ? "Strong " : ""}
                                {crypto.technicalIndicators.technicalOutlook.outlook}
                              </span>
                            </h4>
                            <p className="text-sm text-gray-300 mb-3">
                              {crypto.technicalIndicators.technicalOutlook.description}
                            </p>
                            <div className="bg-slate-800/30 p-2 rounded-md">
                              <h5 className="text-sm font-medium mb-1 flex items-center">
                                <Info className="h-3 w-3 mr-1 text-primary" />
                                Prediction
                              </h5>
                              <p className="text-sm text-gray-300">
                                {crypto.technicalIndicators.technicalOutlook.prediction}
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))
              ) : (
                <div className="text-center py-8 text-gray-300 bg-slate-850/50 rounded-lg p-6">
                  No cryptocurrencies found matching your search.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-sm text-gray-400 text-center">
          Last updated: {new Date(technicalData.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
