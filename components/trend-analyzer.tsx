"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Zap,
  Info,
} from "lucide-react"
import { fetchTrendAnalysis } from "@/lib/trend-api"

export function TrendAnalyzer() {
  const [trendData, setTrendData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Update the loadTrendData function to better handle errors
  const loadTrendData = async () => {
    try {
      setIsLoading(true)
      const data = await fetchTrendAnalysis()
      setTrendData(data)

      // Check if the response contains an error message from our fallback
      if (data.error) {
        setError(data.error)
      } else {
        setError(null)
      }
    } catch (err) {
      console.error("Failed to fetch trend analysis:", err)
      setError("Failed to load trend analysis. Using fallback data due to API limitations.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Also update the useEffect to add a retry mechanism with exponential backoff
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 3
    const retryDelay = 2000 // Start with 2 seconds

    const loadDataWithRetry = async () => {
      try {
        await loadTrendData()
      } catch (err) {
        if (retryCount < maxRetries) {
          const delay = retryDelay * Math.pow(2, retryCount)
          console.log(`Retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`)
          retryCount++
          setTimeout(loadDataWithRetry, delay)
        }
      }
    }

    loadDataWithRetry()

    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(
      () => {
        console.log("Auto-refreshing trend data")
        loadTrendData()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(intervalId)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadTrendData()
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
            {trendData ? (
              <Alert className="bg-yellow-900/20 border-yellow-800/50 mb-5 text-yellow-300">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Showing cached or simulated data due to CoinGecko API rate limits. The data may not reflect current
                  market conditions.
                </AlertDescription>
              </Alert>
            ) : (
              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Try Again"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!trendData) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-300">
            <p className="mb-4">No trend data available at the moment.</p>
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
            Trend Analyzer
            <Badge variant="outline" className="ml-2 bg-primary/20 text-primary border-primary/30">
              BETA
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Analysis based on price action, volume, and social signals
          </CardDescription>
        </div>
        <Button onClick={handleRefresh} variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <Alert className="bg-yellow-900/20 border-yellow-800/50 mb-5 text-yellow-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">{trendData.disclaimer}</AlertDescription>
        </Alert>

        <Tabs defaultValue="potential-pumps">
          <TabsList className="grid grid-cols-4 mb-5 bg-slate-850/70">
            <TabsTrigger
              value="potential-pumps"
              className="text-xs sm:text-sm data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <TrendingUp className="h-3 w-3 mr-1 sm:mr-2" /> Bullish Signals
            </TabsTrigger>
            <TabsTrigger
              value="potential-drops"
              className="text-xs sm:text-sm data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
            >
              <TrendingDown className="h-3 w-3 mr-1 sm:mr-2" /> Bearish Signals
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="text-xs sm:text-sm data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400"
            >
              <Zap className="h-3 w-3 mr-1 sm:mr-2" /> Trending
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="text-xs sm:text-sm data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              <MessageSquare className="h-3 w-3 mr-1 sm:mr-2" /> News
            </TabsTrigger>
          </TabsList>

          {/* Potential Pumps Tab */}
          <TabsContent value="potential-pumps">
            <div className="space-y-4">
              {trendData.potentialPumps.length > 0 ? (
                trendData.potentialPumps.map((coin) => (
                  <Card key={coin.id} className="trend-up-gradient border-green-500/20 overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shadow-md">
                            {coin.image ? (
                              <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-10 h-10" />
                            ) : (
                              <div className="text-xl font-bold">{coin.symbol?.charAt(0)}</div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{coin.name}</h3>
                              <span className="text-gray-400 text-sm">{coin.symbol?.toUpperCase()}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-1">
                              <div className="text-base">
                                <span className="font-medium">${(coin.currentPrice || 0).toLocaleString()}</span>
                                <span className="text-gray-400 ml-1">/ £{(coin.gbpPrice || 0).toLocaleString()}</span>
                              </div>
                              <span className="flex items-center text-green-500 font-medium">
                                <ArrowUp className="h-4 w-4 mr-1" />
                                {Math.abs(coin.priceChange1h || 0).toFixed(2)}% (1h)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="hidden md:block">
                          <div className="flex flex-wrap gap-1">
                            {coin.signals.map((signal, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-green-500/20 text-green-400 border-green-500/30"
                              >
                                {signal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-gray-300">
                        <div>
                          <div className="font-medium">24h Change</div>
                          <div className={coin.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                            {(coin.priceChange24h || 0).toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">7d Change</div>
                          <div className={coin.priceChange7d >= 0 ? "text-green-500" : "text-red-500"}>
                            {(coin.priceChange7d || 0).toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Volume/MCap</div>
                          <div>{(coin.volumeToMarketCap || 0).toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="md:hidden mt-3">
                        <div className="flex flex-wrap gap-1">
                          {coin.signals.map((signal, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-green-500/20 text-green-400 border-green-500/30"
                            >
                              {signal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-300">
                  No coins with bullish signals detected at the moment.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Potential Drops Tab */}
          <TabsContent value="potential-drops">
            <div className="space-y-4">
              {trendData.potentialDrops.length > 0 ? (
                trendData.potentialDrops.map((coin) => (
                  <Card key={coin.id} className="trend-down-gradient border-red-500/20 overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shadow-md">
                            {coin.image ? (
                              <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-10 h-10" />
                            ) : (
                              <div className="text-xl font-bold">{coin.symbol?.charAt(0)}</div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{coin.name}</h3>
                              <span className="text-gray-400 text-sm">{coin.symbol?.toUpperCase()}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-1">
                              <div className="text-base">
                                <span className="font-medium">${(coin.currentPrice || 0).toLocaleString()}</span>
                                <span className="text-gray-400 ml-1">/ £{(coin.gbpPrice || 0).toLocaleString()}</span>
                              </div>
                              <span className="flex items-center text-red-500 font-medium">
                                <ArrowDown className="h-4 w-4 mr-1" />
                                {Math.abs(coin.priceChange1h || 0).toFixed(2)}% (1h)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="hidden md:block">
                          <div className="flex flex-wrap gap-1">
                            {coin.signals.map((signal, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-red-500/20 text-red-400 border-red-500/30"
                              >
                                {signal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-gray-300">
                        <div>
                          <div className="font-medium">24h Change</div>
                          <div className={coin.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                            {(coin.priceChange24h || 0).toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">7d Change</div>
                          <div className={coin.priceChange7d >= 0 ? "text-green-500" : "text-red-500"}>
                            {(coin.priceChange7d || 0).toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Volume/MCap</div>
                          <div>{(coin.volumeToMarketCap || 0).toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="md:hidden mt-3">
                        <div className="flex flex-wrap gap-1">
                          {coin.signals.map((signal, idx) => (
                            <Badge key={idx} variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                              {signal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-300">
                  No coins with bearish signals detected at the moment.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending">
            <div className="space-y-4">
              {trendData.trendingCoins.length > 0 ? (
                trendData.trendingCoins.map((coin) => (
                  <Card key={coin.id} className="neutral-gradient border-yellow-500/20 overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shadow-md">
                            {coin.image ? (
                              <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-10 h-10" />
                            ) : (
                              <div className="text-xl font-bold">{coin.symbol?.charAt(0)}</div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{coin.name}</h3>
                              <span className="text-gray-400 text-sm">{coin.symbol?.toUpperCase()}</span>
                              {coin.marketCapRank && (
                                <Badge variant="outline" className="bg-slate-800/50 border-slate-700">
                                  Rank #{coin.marketCapRank}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-yellow-600 text-white">Trending</Badge>
                              <div className="text-sm text-gray-300">
                                ${(coin.price || 0).toLocaleString()} / £{(coin.gbpPrice || 0).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {coin.signals.map((signal, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            >
                              {signal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-300">No trending coins available at the moment.</div>
              )}
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <div className="space-y-4">
              {trendData.topNewsMentions.length > 0 ? (
                trendData.topNewsMentions.map((coin) => (
                  <Card key={coin.id} className="bg-slate-850/70 border-blue-500/20 overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shadow-md">
                            {coin.image ? (
                              <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-10 h-10" />
                            ) : (
                              <div className="text-xl font-bold">{coin.symbol?.charAt(0)}</div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{coin.name}</h3>
                              <span className="text-gray-400 text-sm">{coin.symbol?.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                <span>{coin.mentions} mentions</span>
                              </div>
                              <Badge
                                className={
                                  coin.sentiment > 0.6
                                    ? "bg-green-600 text-white"
                                    : coin.sentiment < 0.4
                                      ? "bg-red-600 text-white"
                                      : "bg-yellow-600 text-white"
                                }
                              >
                                {coin.sentiment > 0.6 ? "Positive" : coin.sentiment < 0.4 ? "Negative" : "Neutral"}{" "}
                                Sentiment
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-300 mb-2">Recent Headlines:</div>
                        <ul className="space-y-2 text-base text-gray-300">
                          {coin.headlines.map((headline, idx) => (
                            <li key={idx} className="flex items-start bg-slate-800/30 p-3 rounded-md">
                              <Info className="h-4 w-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                              {headline}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-300">No news data available at the moment.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-sm text-gray-400 text-center">
          Last updated: {new Date(trendData.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
