"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Youtube, TrendingUp, Eye, ThumbsUp, MessageSquare, ArrowUp, ArrowDown, Info } from "lucide-react"
import { fetchYoutubeStats } from "@/lib/youtube-api"

export function YoutubePopularity() {
  const [youtubeData, setYoutubeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadYoutubeData = async () => {
    try {
      setIsLoading(true)
      const data = await fetchYoutubeStats()
      setYoutubeData(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch YouTube statistics:", err)
      setError("Failed to load YouTube statistics. Please try again later.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadYoutubeData()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadYoutubeData()
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    } else {
      return num.toString()
    }
  }

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 70) return "bg-green-500 text-white"
    if (sentiment <= 40) return "bg-red-500 text-white"
    return "bg-yellow-500 text-slate-950"
  }

  const getSentimentLabel = (sentiment) => {
    if (sentiment >= 70) return "Bullish"
    if (sentiment <= 40) return "Bearish"
    return "Neutral"
  }

  const getGrowthColor = (growth) => {
    if (growth > 20) return "text-green-500"
    if (growth < 0) return "text-red-500"
    return "text-yellow-500"
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

  if (!youtubeData || !youtubeData.data) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-300">
            <p className="mb-4">No YouTube data available at the moment.</p>
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
            <Youtube className="mr-2 h-5 w-5 text-red-500" />
            YouTube Popularity
          </CardTitle>
          <CardDescription className="text-gray-400">Video content trends for top cryptocurrencies</CardDescription>
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
            Data shows YouTube video metrics for the last 24 hours
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="bar-chart">
          <TabsList className="grid grid-cols-2 mb-5 bg-slate-850/70">
            <TabsTrigger value="bar-chart" className="text-sm">
              <Eye className="h-4 w-4 mr-2" /> Popularity Chart
            </TabsTrigger>
            <TabsTrigger value="detailed-list" className="text-sm">
              <MessageSquare className="h-4 w-4 mr-2" /> Detailed List
            </TabsTrigger>
          </TabsList>

          {/* Bar Chart View */}
          <TabsContent value="bar-chart">
            <div className="space-y-1">
              {youtubeData.data.slice(0, 10).map((coin, index) => {
                // Calculate bar width as percentage of the highest value
                const maxViews = youtubeData.data[0].youtubeMetrics.totalViews24h
                const barWidthPercent = (coin.youtubeMetrics.totalViews24h / maxViews) * 100

                return (
                  <div key={coin.id} className="group">
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden mr-2">
                        <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="font-medium truncate">{coin.name}</span>
                          <span className="text-gray-400 text-xs ml-1">({coin.symbol.toUpperCase()})</span>
                          {coin.youtubeMetrics.isTrending && (
                            <Badge className="ml-2 bg-red-500/20 text-red-400 border-red-500/30">
                              <TrendingUp className="h-3 w-3 mr-1" /> Trending
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm font-medium">
                        {formatNumber(coin.youtubeMetrics.totalViews24h)} views
                      </div>
                    </div>

                    <div className="h-7 w-full bg-slate-800/50 rounded-md overflow-hidden flex items-center">
                      <div
                        className="h-full bg-gradient-to-r from-red-600/80 to-red-500/60 flex items-center transition-all duration-500 group-hover:from-red-600 group-hover:to-red-500"
                        style={{ width: `${barWidthPercent}%` }}
                      >
                        <div className="px-2 text-xs font-medium text-white truncate">
                          {coin.youtubeMetrics.videoCount24h} videos
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mt-1 mb-3">
                      <div className="flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {Math.round(coin.youtubeMetrics.engagement.likesRatio * 100)}% positive
                      </div>
                      <div
                        className={`flex items-center ${getGrowthColor(coin.youtubeMetrics.growth.viewsGrowthPercent)}`}
                      >
                        {coin.youtubeMetrics.growth.viewsGrowthPercent > 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(coin.youtubeMetrics.growth.viewsGrowthPercent)}% from last week
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* Detailed List View */}
          <TabsContent value="detailed-list">
            <div className="space-y-4">
              {youtubeData.data.slice(0, 7).map((coin) => (
                <Card key={coin.id} className="bg-slate-850/70 border-slate-700/50 overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden mr-3">
                          <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold">{coin.name}</h3>
                            <span className="text-gray-400 text-xs ml-1">({coin.symbol.toUpperCase()})</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <span>Rank #{coin.marketCapRank}</span>
                            {coin.youtubeMetrics.isTrending && (
                              <Badge className="ml-2 bg-red-500/20 text-red-400 border-red-500/30">
                                <TrendingUp className="h-3 w-3 mr-1" /> Trending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Badge className={`${getSentimentColor(coin.youtubeMetrics.sentiment)}`}>
                        {getSentimentLabel(coin.youtubeMetrics.sentiment)} Content
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3 bg-slate-800/30 p-2 rounded-md">
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Videos (24h)</div>
                        <div className="font-medium">{coin.youtubeMetrics.videoCount24h}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Total Views</div>
                        <div className="font-medium">{formatNumber(coin.youtubeMetrics.totalViews24h)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Avg. Views</div>
                        <div className="font-medium">{formatNumber(coin.youtubeMetrics.avgViewsPerVideo)}</div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <div className="font-medium mb-2">Popular Video Topics:</div>
                      <ul className="space-y-1.5">
                        {coin.youtubeMetrics.topVideoTitles.slice(0, 3).map((title, idx) => (
                          <li key={idx} className="flex items-start bg-slate-800/20 p-2 rounded-md">
                            <Youtube className="h-4 w-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                            <span className="text-gray-300">{title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-sm text-gray-400 text-center">
          Last updated: {new Date(youtubeData.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
