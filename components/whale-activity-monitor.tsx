"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ExternalLink,
  RefreshCw,
  FishIcon as Whale,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Clock,
  Minus,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// This would be fetched from an API in a real implementation
const MOCK_WHALE_TRANSACTIONS = [
  {
    id: "tx1",
    blockchain: "Ethereum",
    token: "ETH",
    tokenName: "Ethereum",
    amount: 1250,
    usdValue: 3125000,
    type: "sell",
    fromAddress: "0x28c6c06298d514db089934071355e5743bf21d60",
    toAddress: "0x21a31ee1afc51d94c2efccaa2092ad1028285549",
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    exchangeOrWallet: "Binance",
    impact: {
      priceImpact: -1.2,
      liquidityChange: -0.8,
      marketSentiment: "bearish",
    },
  },
  {
    id: "tx2",
    blockchain: "Bitcoin",
    token: "BTC",
    tokenName: "Bitcoin",
    amount: 320,
    usdValue: 19200000,
    type: "buy",
    fromAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    toAddress: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    exchangeOrWallet: "Unknown Wallet",
    impact: {
      priceImpact: 0.7,
      liquidityChange: 0.5,
      marketSentiment: "bullish",
    },
  },
  {
    id: "tx3",
    blockchain: "Solana",
    token: "SOL",
    tokenName: "Solana",
    amount: 125000,
    usdValue: 12500000,
    type: "buy",
    fromAddress: "5FHwkrdxD5AKmYyFNePM9pPF9zVf5FxH5P8vK4rWjgv1",
    toAddress: "7YH1xr9vLcJ6HwYggmF9qF7bFg1VKdGvgKgBJGPzV9yP",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    exchangeOrWallet: "Phantom Wallet",
    impact: {
      priceImpact: 1.5,
      liquidityChange: 1.2,
      marketSentiment: "bullish",
    },
  },
  {
    id: "tx4",
    blockchain: "Binance Smart Chain",
    token: "BNB",
    tokenName: "Binance Coin",
    amount: 45000,
    usdValue: 15750000,
    type: "transfer",
    fromAddress: "0x8894e0a0c962cb723c1976a4421c95949be2d4e3",
    toAddress: "0x3e2ea9e93f0c1e164000485be5d21a98d4c753b3",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    exchangeOrWallet: "Binance to Unknown",
    impact: {
      priceImpact: 0.2,
      liquidityChange: 0.1,
      marketSentiment: "neutral",
    },
  },
  {
    id: "tx5",
    blockchain: "Cardano",
    token: "ADA",
    tokenName: "Cardano",
    amount: 15000000,
    usdValue: 6750000,
    type: "sell",
    fromAddress:
      "addr1qxkfe8s6m8qt5436lec3f0320hrmpppwqgs2gah4360krvyssntpwjcz303mx3h4avg7p9snx3njkjh0cek9kylkjmqts3580",
    toAddress: "addr1q8xjhzr8yvad7kx8q2vvgtv4xz4c8vfz9pzgxj3zprhs9dkjh0cek9kylkjmqgmc5fd",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    exchangeOrWallet: "Kraken",
    impact: {
      priceImpact: -0.9,
      liquidityChange: -0.6,
      marketSentiment: "bearish",
    },
  },
]

export function WhaleActivityMonitor() {
  const [whaleTransactions, setWhaleTransactions] = useState(MOCK_WHALE_TRANSACTIONS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return ""
    if (address.length <= 16) return address
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
  }

  // Get color based on transaction type
  const getTransactionColor = (type) => {
    switch (type) {
      case "buy":
        return "text-green-500"
      case "sell":
        return "text-red-500"
      default:
        return "text-blue-500"
    }
  }

  // Get badge color based on sentiment
  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case "bullish":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "bearish":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  // Get impact icon based on price impact
  const getImpactIcon = (impact) => {
    if (impact > 0.5) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (impact < -0.5) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-yellow-500" />
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-medium text-gray-200 flex items-center">
            <Whale className="mr-2 h-5 w-5 text-primary" />
            Whale Activity Monitor
          </CardTitle>
          <CardDescription className="text-gray-400">
            Track large transactions that could impact the market
          </CardDescription>
        </div>
        <Button onClick={handleRefresh} variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <Alert className="bg-slate-800/50 border-slate-700/50 mb-5 text-gray-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Whale movements can significantly impact market prices. Monitor these transactions to anticipate potential
            market shifts.
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/30 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-6 w-32 bg-slate-700" />
                  <Skeleton className="h-6 w-24 bg-slate-700" />
                </div>
                <Skeleton className="h-16 w-full bg-slate-700" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {whaleTransactions.map((tx) => (
              <div key={tx.id} className="bg-slate-800/30 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center">
                    <Badge
                      className={`mr-2 ${
                        tx.type === "buy"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : tx.type === "sell"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {tx.type.toUpperCase()}
                    </Badge>
                    <span className="font-medium text-gray-200">{tx.tokenName}</span>
                    <span className="text-gray-400 text-sm ml-1">({tx.token})</span>
                    <Badge className="ml-2 bg-slate-700/50 text-gray-300">{tx.blockchain}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Amount</div>
                    <div className={`text-lg font-medium ${getTransactionColor(tx.type)}`}>
                      {tx.type === "sell" ? "-" : tx.type === "buy" ? "+" : ""}
                      {tx.amount.toLocaleString()} {tx.token}
                    </div>
                    <div className="text-sm text-gray-400">${tx.usdValue.toLocaleString()}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1">From/To</div>
                    <div className="text-sm">
                      <span className="text-gray-300">{formatAddress(tx.fromAddress)}</span>
                      <span className="text-gray-500 mx-1">→</span>
                      <span className="text-gray-300">{formatAddress(tx.toAddress)}</span>
                    </div>
                    <div className="text-sm text-gray-400">{tx.exchangeOrWallet}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1">Market Impact</div>
                    <div className="flex items-center">
                      {getImpactIcon(tx.impact.priceImpact)}
                      <span
                        className={`ml-1 ${
                          tx.impact.priceImpact > 0
                            ? "text-green-500"
                            : tx.impact.priceImpact < 0
                              ? "text-red-500"
                              : "text-gray-300"
                        }`}
                      >
                        {tx.impact.priceImpact > 0 ? "+" : ""}
                        {tx.impact.priceImpact}% price impact
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Badge className={`text-xs ${getSentimentBadge(tx.impact.marketSentiment)}`}>
                        {tx.impact.marketSentiment} sentiment
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Transaction
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-slate-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-200 mb-2 flex items-center">
            <Info className="h-4 w-4 mr-2 text-primary" />
            Whale Activity Analysis
          </h4>
          <p className="text-sm text-gray-300">
            Recent whale activity suggests a <strong className="text-green-400">cautiously bullish</strong> outlook.
            Large buys on Solana and Bitcoin indicate institutional confidence, while the Ethereum sell could be profit
            taking rather than a shift in sentiment. Monitor for follow-up transactions from the same addresses.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-slate-700/30 p-2 rounded">
              <div className="text-xs text-gray-400">24h Whale Buy Volume</div>
              <div className="text-lg font-medium text-green-500">$31.95M</div>
            </div>
            <div className="bg-slate-700/30 p-2 rounded">
              <div className="text-xs text-gray-400">24h Whale Sell Volume</div>
              <div className="text-lg font-medium text-red-500">$9.88M</div>
            </div>
            <div className="bg-slate-700/30 p-2 rounded">
              <div className="text-xs text-gray-400">Net Flow</div>
              <div className="text-lg font-medium text-green-500">+$22.07M</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
