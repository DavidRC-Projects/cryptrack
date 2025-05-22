"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowDown, ArrowUp, ExternalLink, Twitter, Github, MessageSquare, ChevronDown, BarChart3, Info, TrendingUp, Activity, MessageCircle, Newspaper, ArrowUpToLine } from "lucide-react"
import Link from "next/link"
import { fetchCryptoDetails, fetchSentimentData } from "@/lib/crypto-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CryptoAPIError } from "@/lib/errors"
import { AlertTriangle, RefreshCw, WifiOff, Timer, Server } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface CryptoDetails {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  price_change_percentage_7d: number
  price_change_percentage_30d: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  high_24h_date: string
  low_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number | null
  image: string
  description: string
  gbp_price: number
  gbp_market_cap: number
  volume_gbp_24h: number
  gbp_high_24h: number
  sentiment_score: number
  links: {
    homepage: string[]
    blockchain_site: string[]
    official_forum_url: string[]
    chat_url: string[]
    announcement_url: string[]
    twitter_screen_name: string
    facebook_username: string
    telegram_channel_identifier: string
    subreddit_url: string
    repos_url: {
      github: string[]
      bitbucket: string[]
    }
  }
}

interface SentimentData {
  sentiment_score: number
  social_volume: number
  social_engagement: number
  social_dominance: number
  market_sentiment: "bullish" | "bearish" | "neutral"
  trending_topics: Array<{
    topic: string
    sentiment: number
    volume: number
  }>
}

interface PageProps {
  params: {
    id: string
  }
}

const getErrorIcon = (type: CryptoAPIError['type']) => {
  switch (type) {
    case 'NETWORK':
      return <WifiOff className="h-5 w-5" />
    case 'RATE_LIMIT':
      return <Timer className="h-5 w-5" />
    case 'SERVER_ERROR':
      return <Server className="h-5 w-5" />
    case 'NOT_FOUND':
      return <AlertCircle className="h-5 w-5" />
    case 'INVALID_DATA':
      return <AlertCircle className="h-5 w-5" />
    default:
      return <AlertTriangle className="h-5 w-5" />
  }
}

const getErrorStyles = (type: CryptoAPIError['type']) => {
  const baseStyles = "text-white"
  switch (type) {
    case 'NETWORK':
      return cn(baseStyles, "bg-blue-900/50 border-blue-800/50")
    case 'RATE_LIMIT':
      return cn(baseStyles, "bg-yellow-900/50 border-yellow-800/50")
    case 'SERVER_ERROR':
      return cn(baseStyles, "bg-red-900/50 border-red-800/50")
    case 'NOT_FOUND':
      return cn(baseStyles, "bg-purple-900/50 border-purple-800/50")
    case 'INVALID_DATA':
      return cn(baseStyles, "bg-orange-900/50 border-orange-800/50")
    default:
      return cn(baseStyles, "bg-red-900/50 border-red-800/50")
  }
}

const getErrorTitle = (type: CryptoAPIError['type']) => {
  switch (type) {
    case 'NETWORK':
      return 'Connection Issue'
    case 'RATE_LIMIT':
      return 'Rate Limit Reached'
    case 'SERVER_ERROR':
      return 'Server Error'
    case 'NOT_FOUND':
      return 'Not Found'
    case 'INVALID_DATA':
      return 'Invalid Data'
    default:
      return 'Error'
  }
}

const getErrorSubtitle = (type: CryptoAPIError['type']) => {
  switch (type) {
    case 'NETWORK':
      return 'Unable to connect to the server'
    case 'RATE_LIMIT':
      return 'Too many requests, please wait'
    case 'SERVER_ERROR':
      return 'Something went wrong on our end'
    case 'NOT_FOUND':
      return 'The requested cryptocurrency was not found'
    case 'INVALID_DATA':
      return 'Received invalid data from the server'
    default:
      return 'An unexpected error occurred'
  }
}

export default function CryptoDetailPage({ params }: PageProps) {
  const { id } = params
  const [crypto, setCrypto] = useState<CryptoDetails | null>(null)
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<CryptoAPIError | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null)
  const [retryProgress, setRetryProgress] = useState(0)

  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [retryTimeout])

  const loadData = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setIsLoading(true)
        setRetryProgress(0)
      }
      const [cryptoData, sentimentData] = await Promise.all([
        fetchCryptoDetails(id),
        fetchSentimentData(id),
      ])
      setCrypto(cryptoData)
      setSentiment(sentimentData)
      setError(null)
      setRetryCount(0)
      setRetryProgress(0)
    } catch (err) {
      const apiError = CryptoAPIError.fromError(err, retryCount)
      console.error("Failed to fetch data:", apiError)
      setError(apiError)

      if (apiError.shouldRetry) {
        const retryState = apiError.retryState
        const startTime = Date.now()
        const updateProgress = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min((elapsed / retryState.nextRetryIn) * 100, 100)
          setRetryProgress(progress)
        }

        // Update progress every 100ms
        const progressInterval = setInterval(updateProgress, 100)
        
        const timeout = setTimeout(() => {
          clearInterval(progressInterval)
          setRetryCount(prev => prev + 1)
          loadData(true)
        }, retryState.nextRetryIn)

        setRetryTimeout(timeout)
      }
    } finally {
      if (!isRetry) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen crypto-gradient text-white flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium text-gray-300">Loading...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we fetch the latest data</p>
      </div>
    )
  }

  if (error) {
    const retryState = error.retryState
    const errorStyles = getErrorStyles(error.type)
    const errorIcon = getErrorIcon(error.type)
    const errorTitle = getErrorTitle(error.type)
    const errorSubtitle = getErrorSubtitle(error.type)

    return (
      <div className="min-h-screen crypto-gradient text-white p-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>

        <Alert variant="destructive" className={errorStyles}>
          <div className="flex items-start gap-4">
            <div className="mt-0.5">{errorIcon}</div>
            <div className="flex-1 space-y-2">
              <div>
                <AlertTitle className="text-lg font-semibold">{errorTitle}</AlertTitle>
                <p className="text-sm text-gray-300 mt-1">{errorSubtitle}</p>
              </div>

              <AlertDescription className="mt-4 space-y-4">
                <div className="bg-black/20 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-200">{error.userMessage}</p>
                  {error.statusCode && (
                    <p className="text-xs text-gray-400">Status code: {error.statusCode}</p>
                  )}
                </div>

                {retryState.canRetry && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-gray-200">Retrying automatically...</span>
                      </div>
                      <Badge variant="outline" className="bg-white/5">
                        Attempt {retryState.retryCount + 1} of {retryState.maxRetries}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress 
                        value={retryProgress} 
                        className={cn(
                          "h-2 bg-black/20",
                          "[&>div]:transition-all [&>div]:duration-100",
                          error.type === 'RATE_LIMIT' ? "[&>div]:bg-yellow-500" :
                          error.type === 'NETWORK' ? "[&>div]:bg-blue-500" :
                          "[&>div]:bg-red-500"
                        )}
                      />
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Retry progress</span>
                        <span>
                          {Math.ceil((retryState.nextRetryIn - (retryProgress / 100 * retryState.nextRetryIn)) / 1000)}s remaining
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Info className="h-3 w-3" />
                      <span>
                        {error.type === 'RATE_LIMIT' 
                          ? "Waiting to respect API rate limits"
                          : error.type === 'NETWORK'
                          ? "Checking for network connectivity"
                          : "Attempting to recover from server error"}
                      </span>
                    </div>
                  </div>
                )}

                {!retryState.canRetry && (
                  <div className="space-y-4">
                    <div className="bg-black/20 rounded-lg p-4">
                      <p className="text-sm text-gray-200">
                        {retryState.retryCount >= retryState.maxRetries
                          ? "We've tried multiple times but couldn't recover automatically. Please try again manually."
                          : "This type of error cannot be automatically retried. Please try again manually."}
                      </p>
                    </div>
                    <Button 
                      onClick={() => {
                        setRetryCount(0)
                        loadData()
                      }} 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/10 hover:bg-white/20"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    )
  }

  if (!crypto) {
    return (
      <div className="min-h-screen crypto-gradient text-white flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cryptocurrency not found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Handle potential null values
  const priceChangePercentage24h = crypto.price_change_percentage_24h || 0
  const priceChangeColor = priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"

  const sentimentScore = crypto.sentiment_score || 50
  const sentimentColor =
    sentimentScore > 70
      ? "bg-green-500 text-white"
      : sentimentScore < 30
        ? "bg-red-500 text-white"
        : "bg-yellow-500 text-slate-950"

  const sentimentLabel = sentimentScore > 70 ? "Bullish" : sentimentScore < 30 ? "Bearish" : "Neutral"

  return (
    <div className="min-h-screen crypto-gradient text-white">
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700">
                Jump to Section <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700">
              <DropdownMenuItem onClick={() => scrollToSection("overview-section")} className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection("market-stats")} className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Market Statistics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection("about-section")} className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                About {crypto?.name}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection("price-changes")} className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Price Changes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection("sentiment-analysis")} className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Sentiment Analysis
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection("social-sentiment")} className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Social Media Sentiment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollToSection("news-updates")} className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                News & Updates
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10" id="main-content">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shadow-glow">
              {crypto.image ? (
                <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-16 h-16" />
              ) : (
                <div className="text-3xl font-bold">{crypto.symbol?.charAt(0)}</div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                  {crypto.name}
                </h1>
                <span className="text-gray-400 text-lg">{crypto.symbol?.toUpperCase()}</span>
                <Badge className="ml-2 bg-slate-800/70 text-gray-300">Rank #{crypto.market_cap_rank || "N/A"}</Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                <div>
                  <span className="text-2xl font-medium">${(crypto.current_price || 0).toLocaleString()}</span>
                  <span className="text-gray-400 ml-2">/ £{(crypto.gbp_price || 0).toLocaleString()}</span>
                </div>
                <span className={`flex items-center ${priceChangeColor} font-medium`}>
                  {priceChangePercentage24h >= 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(priceChangePercentage24h).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="md:ml-auto flex flex-col md:flex-row items-start md:items-center gap-3">
            <Badge className={`${sentimentColor} text-lg py-1 px-4 font-medium`}>{sentimentLabel} Sentiment</Badge>

            <div className="flex gap-2">
              {crypto.links.homepage.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700"
                >
                  <Link href={crypto.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" /> Website
                  </Link>
                </Button>
              )}
              {crypto.links.twitter_screen_name && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700"
                >
                  <Link href={`https://twitter.com/${crypto.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4 mr-1" /> Twitter
                  </Link>
                </Button>
              )}
              {crypto.links.repos_url.github.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700"
                >
                  <Link href={crypto.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-1" /> GitHub
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-slate-850/70">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sentiment"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Sentiment Analysis
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              News & Updates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div id="overview-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass-card overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Market Cap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">${(crypto.market_cap || 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-400">£{(crypto.gbp_market_cap || 0).toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="glass-card overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">24h Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">${(crypto.total_volume || 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-400">£{(crypto.volume_gbp_24h || 0).toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="glass-card overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Circulating Supply</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">
                    {Math.floor(crypto.circulating_supply || 0).toLocaleString()} {crypto.symbol?.toUpperCase()}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">All-Time High</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">${(crypto.high_24h || 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-400">£{(crypto.gbp_high_24h || 0).toLocaleString()}</div>
                  {crypto.high_24h_date && (
                    <div className="text-xs text-gray-400">{new Date(crypto.high_24h_date).toLocaleDateString()}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card id="about-section" className="glass-card overflow-hidden mb-8">
              <CardHeader>
                <CardTitle>About {crypto.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {crypto.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: crypto.description }}
                    className="text-gray-300 leading-relaxed"
                  />
                ) : (
                  <p>No description available.</p>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card id="price-changes" className="glass-card overflow-hidden">
                <CardHeader>
                  <CardTitle>Price Change</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>24h</span>
                      <span className={crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}>
                        {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                        {(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>7d</span>
                      <span className={crypto.price_change_percentage_7d >= 0 ? "text-green-500" : "text-red-500"}>
                        {crypto.price_change_percentage_7d >= 0 ? "+" : ""}
                        {(crypto.price_change_percentage_7d || 0).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>30d</span>
                      <span className={crypto.price_change_percentage_30d >= 0 ? "text-green-500" : "text-red-500"}>
                        {crypto.price_change_percentage_30d >= 0 ? "+" : ""}
                        {(crypto.price_change_percentage_30d || 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card id="market-stats" className="glass-card overflow-hidden">
                <CardHeader>
                  <CardTitle>Market Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span>Overall Sentiment</span>
                    <Badge className={`${sentimentColor}`}>{sentimentLabel}</Badge>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-4 mb-6">
                    <div
                      className={`h-4 rounded-full ${
                        sentimentScore > 70 ? "bg-green-500" : sentimentScore < 30 ? "bg-red-500" : "bg-yellow-500"
                      }`}
                      style={{ width: `${sentimentScore}%` }}
                    ></div>
                  </div>

                  <div className="text-sm text-gray-400">
                    Based on news sentiment, social media activity, and market indicators
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sentiment">
            {sentiment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card id="social-sentiment" className="glass-card overflow-hidden">
                  <CardHeader>
                    <CardTitle>Social Media Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Twitter</span>
                          <span>{sentiment.social_engagement.toFixed(0)}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${sentiment.social_engagement}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Reddit</span>
                          <span>{sentiment.social_dominance.toFixed(0)}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-orange-500"
                            style={{ width: `${sentiment.social_dominance}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Telegram</span>
                          <span>{sentiment.social_volume.toFixed(0)}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-400"
                            style={{ width: `${sentiment.social_volume}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card id="sentiment-analysis" className="glass-card overflow-hidden">
                  <CardHeader>
                    <CardTitle>News Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-6">
                      <div className="w-full max-w-xs mx-auto">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-500">
                            Positive: {(sentiment.trending_topics.filter(t => t.sentiment > 0).length / sentiment.trending_topics.length * 100).toFixed(0)}%
                          </span>
                          <span className="text-yellow-500">
                            Neutral: {(sentiment.trending_topics.filter(t => t.sentiment === 0).length / sentiment.trending_topics.length * 100).toFixed(0)}%
                          </span>
                          <span className="text-red-500">
                            Negative: {(sentiment.trending_topics.filter(t => t.sentiment < 0).length / sentiment.trending_topics.length * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                          <div className="flex h-full">
                            <div
                              className="bg-green-500 h-full"
                              style={{ width: `${sentiment.trending_topics.filter(t => t.sentiment > 0).length / sentiment.trending_topics.length * 100}%` }}
                            ></div>
                            <div
                              className="bg-yellow-500 h-full"
                              style={{ width: `${sentiment.trending_topics.filter(t => t.sentiment === 0).length / sentiment.trending_topics.length * 100}%` }}
                            ></div>
                            <div
                              className="bg-red-500 h-full"
                              style={{ width: `${sentiment.trending_topics.filter(t => t.sentiment < 0).length / sentiment.trending_topics.length * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <h4 className="font-medium mb-2">Top Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {sentiment.trending_topics.map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="flex items-center gap-1 bg-slate-800/50 border-slate-700/50"
                          >
                            {item.topic}
                            <span className="bg-slate-700 text-xs rounded-full px-1.5">{item.volume.toLocaleString()}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card overflow-hidden md:col-span-2">
                  <CardHeader>
                    <CardTitle>Sentiment Trend (7 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {sentiment.trending_topics.map((item, index) => {
                        const height = `${item.sentiment > 0 ? item.sentiment : 0}%`
                        const bgColor =
                          item.sentiment > 0 ? "bg-green-500" : item.sentiment < 0 ? "bg-red-500" : "bg-yellow-500"

                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="w-full relative">
                              <div className={`w-full ${bgColor} rounded-t shadow-glow`} style={{ height }}></div>
                            </div>
                            <div className="text-xs mt-2 text-gray-400">
                              {item.topic}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="news" className="mt-0">
            <Card id="news-updates" className="glass-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sentiment?.trending_topics.slice(0, 5).map((topic, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{topic.topic}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              topic.sentiment > 0
                                ? "bg-green-900/20 border-green-800/50 text-green-300"
                                : topic.sentiment < 0
                                ? "bg-red-900/20 border-red-800/50 text-red-300"
                                : "bg-yellow-900/20 border-yellow-800/50 text-yellow-300"
                            }`}
                          >
                            {topic.sentiment > 0 ? "Positive" : topic.sentiment < 0 ? "Negative" : "Neutral"}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            Volume: {topic.volume.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="icon"
            className="fixed bottom-8 right-8 bg-slate-800/80 border-slate-700/50 hover:bg-slate-700 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Back to top"
          >
            <ArrowUpToLine className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
