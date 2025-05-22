"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Network,
  RefreshCw,
  Search,
  Filter,
  Info,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// This would be fetched from an API in a real implementation
const correlationData = [
  { asset1: "BTC", asset2: "ETH", correlation: 0.84, change: 0.02 },
  { asset1: "BTC", asset2: "SOL", correlation: 0.78, change: 0.05 },
  { asset1: "BTC", asset2: "ADA", correlation: 0.72, change: -0.01 },
  { asset1: "BTC", asset2: "BNB", correlation: 0.83, change: 0.03 },
  { asset1: "BTC", asset2: "XRP", correlation: 0.67, change: -0.04 },
  { asset1: "BTC", asset2: "DOGE", correlation: 0.71, change: 0.06 },
  { asset1: "BTC", asset2: "DOT", correlation: 0.76, change: 0.02 },
  { asset1: "BTC", asset2: "MATIC", correlation: 0.75, change: 0.04 },
  { asset1: "BTC", asset2: "LINK", correlation: 0.73, change: 0.01 },
  { asset1: "BTC", asset2: "AVAX", correlation: 0.77, change: 0.03 },

  { asset1: "ETH", asset2: "SOL", correlation: 0.81, change: 0.04 },
  { asset1: "ETH", asset2: "ADA", correlation: 0.69, change: -0.02 },
  { asset1: "ETH", asset2: "BNB", correlation: 0.79, change: 0.01 },
  { asset1: "ETH", asset2: "XRP", correlation: 0.64, change: -0.03 },
  { asset1: "ETH", asset2: "DOGE", correlation: 0.68, change: 0.05 },
  { asset1: "ETH", asset2: "DOT", correlation: 0.82, change: 0.03 },
  { asset1: "ETH", asset2: "MATIC", correlation: 0.85, change: 0.07 },
  { asset1: "ETH", asset2: "LINK", correlation: 0.87, change: 0.02 },
  { asset1: "ETH", asset2: "AVAX", correlation: 0.83, change: 0.04 },

  { asset1: "SOL", asset2: "ADA", correlation: 0.74, change: 0.03 },
  { asset1: "SOL", asset2: "BNB", correlation: 0.76, change: 0.02 },
  { asset1: "SOL", asset2: "XRP", correlation: 0.65, change: -0.01 },
  { asset1: "SOL", asset2: "DOGE", correlation: 0.67, change: 0.04 },
  { asset1: "SOL", asset2: "DOT", correlation: 0.79, change: 0.05 },
  { asset1: "SOL", asset2: "MATIC", correlation: 0.78, change: 0.06 },
  { asset1: "SOL", asset2: "LINK", correlation: 0.77, change: 0.02 },
  { asset1: "SOL", asset2: "AVAX", correlation: 0.8, change: 0.03 },

  // Adding some weakly and negatively correlated assets
  { asset1: "BTC", asset2: "GOLD", correlation: 0.21, change: -0.08 },
  { asset1: "ETH", asset2: "GOLD", correlation: 0.18, change: -0.05 },
  { asset1: "BTC", asset2: "DXY", correlation: -0.52, change: -0.04 },
  { asset1: "ETH", asset2: "DXY", correlation: -0.48, change: -0.03 },
  { asset1: "SOL", asset2: "GOLD", correlation: 0.15, change: -0.07 },
  { asset1: "ADA", asset2: "DXY", correlation: -0.42, change: -0.06 },
  { asset1: "XRP", asset2: "GOLD", correlation: 0.23, change: -0.04 },
]

const topAssets = ["BTC", "ETH", "SOL", "ADA", "BNB", "XRP", "DOGE", "DOT", "MATIC", "LINK", "AVAX", "GOLD", "DXY"]

export function TokenCorrelationMatrix() {
  const [timeframe, setTimeframe] = useState("30d")
  const [minCorrelation, setMinCorrelation] = useState("-1")
  const [maxCorrelation, setMaxCorrelation] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const [showOpportunities, setShowOpportunities] = useState(true)
  const [sortByCorrelation, setSortByCorrelation] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter and sort the data
  let filteredData = [...correlationData]

  // Apply min/max correlation filters
  const minC = Number.parseFloat(minCorrelation)
  const maxC = Number.parseFloat(maxCorrelation)
  filteredData = filteredData.filter((item) => item.correlation >= minC && item.correlation <= maxC)

  // Apply search filter
  if (searchTerm) {
    filteredData = filteredData.filter(
      (item) =>
        item.asset1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.asset2.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Sort data
  if (sortByCorrelation) {
    filteredData.sort((a, b) => b.correlation - a.correlation)
  } else {
    filteredData.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Function to get correlation class
  const getCorrelationClass = (correlation) => {
    if (correlation >= 0.7) return "text-red-500"
    if (correlation >= 0.5) return "text-yellow-500"
    if (correlation >= 0.3) return "text-blue-500"
    if (correlation >= 0) return "text-green-500"
    if (correlation >= -0.3) return "text-green-400"
    if (correlation >= -0.5) return "text-blue-400"
    return "text-purple-400"
  }

  // Function to get correlation label
  const getCorrelationLabel = (correlation) => {
    if (correlation >= 0.7) return "Strong +"
    if (correlation >= 0.5) return "Moderate +"
    if (correlation >= 0.3) return "Weak +"
    if (correlation >= 0) return "Very Weak +"
    if (correlation >= -0.3) return "Very Weak -"
    if (correlation >= -0.5) return "Weak -"
    if (correlation >= -0.7) return "Moderate -"
    return "Strong -"
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start pb-2">
        <div>
          <CardTitle className="text-xl font-medium text-gray-200 flex items-center">
            <Network className="mr-2 h-5 w-5 text-primary" />
            Asset Correlation Matrix
          </CardTitle>
          <CardDescription className="text-gray-400">
            Analyze relationships between assets for better diversification
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-24 h-8 bg-slate-800/50 border-slate-700/50 text-sm">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="h-8 bg-slate-800/50 border-slate-700/50"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Alert className="bg-slate-800/50 border-slate-700/50 mb-5 text-gray-300">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Correlation ranges from -1 (perfect negative) to 1 (perfect positive). Assets with lower correlation provide
            better diversification and can reduce portfolio risk.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-1 mb-3 sm:mb-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assets..."
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-white h-9 rounded-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 bg-slate-800/50 border-slate-700/50">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>

          <div className="flex justify-between sm:justify-start items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="opp-switch" className="text-xs text-gray-400">
                Show Opportunities
              </Label>
              <Switch id="opp-switch" checked={showOpportunities} onCheckedChange={setShowOpportunities} />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort-switch" className="text-xs text-gray-400">
                Sort by
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => setSortByCorrelation(!sortByCorrelation)}
              >
                {sortByCorrelation ? "Correlation" : "Recent Change"}
                {sortByCorrelation ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-1 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Correlation Range</span>
            <span className="text-xs text-gray-400">-1 (Inverse) to 1 (Perfect)</span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={minCorrelation} onValueChange={setMinCorrelation}>
              <SelectTrigger className="w-28 h-8 bg-slate-800/50 border-slate-700/50 text-sm">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="-1">-1.0</SelectItem>
                <SelectItem value="-0.8">-0.8</SelectItem>
                <SelectItem value="-0.6">-0.6</SelectItem>
                <SelectItem value="-0.4">-0.4</SelectItem>
                <SelectItem value="-0.2">-0.2</SelectItem>
                <SelectItem value="0">0.0</SelectItem>
                <SelectItem value="0.2">0.2</SelectItem>
                <SelectItem value="0.4">0.4</SelectItem>
                <SelectItem value="0.6">0.6</SelectItem>
                <SelectItem value="0.8">0.8</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-gray-500">to</span>
            <Select value={maxCorrelation} onValueChange={setMaxCorrelation}>
              <SelectTrigger className="w-28 h-8 bg-slate-800/50 border-slate-700/50 text-sm">
                <SelectValue placeholder="Max" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="-0.8">-0.8</SelectItem>
                <SelectItem value="-0.6">-0.6</SelectItem>
                <SelectItem value="-0.4">-0.4</SelectItem>
                <SelectItem value="-0.2">-0.2</SelectItem>
                <SelectItem value="0">0.0</SelectItem>
                <SelectItem value="0.2">0.2</SelectItem>
                <SelectItem value="0.4">0.4</SelectItem>
                <SelectItem value="0.6">0.6</SelectItem>
                <SelectItem value="0.8">0.8</SelectItem>
                <SelectItem value="1">1.0</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showOpportunities && (
          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4 mb-5">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-400">Diversification Opportunities</h3>
                <p className="text-xs text-yellow-300/90">
                  Assets with correlation below 0.5 provide better diversification benefits
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {correlationData
                .filter((item) => item.correlation < 0.3 && item.correlation > -0.3)
                .slice(0, 3)
                .map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-800/30 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LOW CORR</Badge>
                      <div className="text-sm">
                        {item.asset1}/{item.asset2}
                      </div>
                    </div>
                    <div className={`text-sm ${getCorrelationClass(item.correlation)}`}>
                      {item.correlation.toFixed(2)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="rounded-lg border border-slate-700/50 overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-800/70 p-3 text-xs font-medium text-gray-300">
            <div>Asset Pair</div>
            <div>Correlation</div>
            <div>Recent Change</div>
          </div>
          <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto">
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 p-3 text-xs sm:text-sm border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center">
                    <span>
                      {item.asset1}/{item.asset2}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`font-medium ${getCorrelationClass(item.correlation)}`}>
                      {item.correlation.toFixed(2)}
                    </div>
                    <Badge
                      className={`ml-2 text-xs hidden sm:inline-flex ${
                        item.correlation >= 0.7
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : item.correlation >= 0.3
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : item.correlation >= 0
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : item.correlation >= -0.3
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {getCorrelationLabel(item.correlation)}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <div className={`flex items-center ${item.change > 0 ? "text-green-400" : "text-red-400"}`}>
                      {item.change > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(item.change).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-gray-400">No correlation data matching your criteria</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          <div className="bg-slate-800/30 p-2 rounded-lg">
            <div className="text-xs text-gray-400">Strong Correlation (0.7-1.0)</div>
            <div className="flex items-center mt-1">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="text-sm text-gray-300">High price dependency</div>
            </div>
          </div>
          <div className="bg-slate-800/30 p-2 rounded-lg">
            <div className="text-xs text-gray-400">Moderate (0.3-0.7)</div>
            <div className="flex items-center mt-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="text-sm text-gray-300">Some diversification</div>
            </div>
          </div>
          <div className="bg-slate-800/30 p-2 rounded-lg">
            <div className="text-xs text-gray-400">Low Correlation (0-0.3)</div>
            <div className="flex items-center mt-1">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <div className="text-sm text-gray-300">Good diversification</div>
            </div>
          </div>
          <div className="bg-slate-800/30 p-2 rounded-lg">
            <div className="text-xs text-gray-400">Negative Correlation</div>
            <div className="flex items-center mt-1">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <div className="text-sm text-gray-300">Inverse price movement</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
