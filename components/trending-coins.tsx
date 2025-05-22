"use client"

import { useState, useEffect } from "react"
import { TrendingUpIcon as TrendUp, TrendingDownIcon as TrendDown, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchTrendingCoins } from "@/lib/crypto-api"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function TrendingCoins() {
  const [trending, setTrending] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadTrending = async () => {
    try {
      setIsLoading(true)
      const data = await fetchTrendingCoins()
      setTrending(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch trending coins:", err)
      setError("Failed to load trending coins. Please try again later.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadTrending()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadTrending()
  }

  if (isLoading) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium text-gray-200">Hot Right Now</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
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
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium text-gray-200">Hot Right Now</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="text-center py-8 text-gray-400">
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

  if (!trending || trending.length === 0) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium text-gray-200">Hot Right Now</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="text-center py-8 text-gray-400">
            <p className="mb-4">No trending coins available at the moment.</p>
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
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-gray-200">Hot Right Now</CardTitle>
        <Button onClick={handleRefresh} variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4">
          {trending.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between border-b border-slate-700/50 pb-3 last:border-0 last:pb-0 hover:bg-slate-800/20 p-2 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shadow-md">
                  {coin.image ? (
                    <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-8 h-8" />
                  ) : (
                    <div className="text-sm font-bold">{coin.symbol?.charAt(0)}</div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-medium text-base">{coin.name}</h3>
                    <span className="text-gray-400 text-xs">{coin.symbol?.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span>
                      ${(coin.price || 0).toLocaleString()} / £{(coin.gbpPrice || 0).toLocaleString()}
                    </span>
                    <span className={coin.sentiment === "bullish" ? "text-green-500" : "text-red-500"}>
                      {coin.sentiment === "bullish" ? (
                        <TrendUp className="h-4 w-4" />
                      ) : (
                        <TrendDown className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                {coin.hotTopic && (
                  <div className="flex items-center text-yellow-500 text-xs font-medium bg-yellow-500/10 px-2 py-1 rounded-full">
                    <Zap className="h-3 w-3 mr-1" />
                    Hot
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
