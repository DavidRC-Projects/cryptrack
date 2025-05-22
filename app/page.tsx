"use client"

import { CryptoList } from "@/components/crypto-list"
import { TrendingCoins } from "@/components/trending-coins"
import { MarketInsights } from "@/components/market-insights"
import { TrendAnalyzer } from "@/components/trend-analyzer"
import { YoutubePopularity } from "@/components/youtube-popularity"
import TechnicalAnalysis from "@/components/technical-analysis"
import { UtilityTokenInsights } from "@/components/utility-token-insights"
import { WhaleActivityMonitor } from "@/components/whale-activity-monitor"
import { OnChainAnalytics } from "@/components/on-chain-analytics"
import { BlockchainFlow } from "@/components/blockchain-flow"
import { TokenCorrelationMatrix } from "@/components/token-correlation-matrix"
import { XRPFuture } from "@/components/xrp-future"
import { RefreshCw } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen crypto-gradient text-white">
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <header className="mb-10 sm:mb-14 text-center md:text-left">
          <div className="hero-gradient px-4 py-10 sm:py-14 rounded-2xl mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 glow-text">
              Crypto Sentinel
            </h1>
            <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Advanced crypto analytics with on-chain data, blockchain flows, and market intelligence
            </p>
            <p className="text-primary text-sm mt-3 flex items-center justify-center md:justify-start">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin-slow" />
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </header>

        {/* Market Insights Section */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16" id="main-content">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">Market Overview</h2>
          <MarketInsights />
        </div>

        {/* XRP Future Section */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">
            XRP Future Outlook
          </h2>
          <XRPFuture />
        </div>

        {/* Whale Activity Monitor */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">
            Whale Activity Monitor
          </h2>
          <WhaleActivityMonitor />
        </div>

        {/* On-chain Analytics Dashboard */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">
            On-Chain Analytics
          </h2>
          <OnChainAnalytics />
        </div>

        {/* Blockchain Flow Visualizer */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">
            Blockchain Flow Visualizer
          </h2>
          <BlockchainFlow />
        </div>

        {/* Token Correlation Matrix */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">
            Token Correlation Matrix
          </h2>
          <TokenCorrelationMatrix />
        </div>

        {/* Utility Token Insights */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">
            Utility Token Insights
          </h2>
          <UtilityTokenInsights />
        </div>

        {/* Technical Analysis Section */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">
            Technical Analysis
          </h2>
          <TechnicalAnalysis />
        </div>

        {/* YouTube Popularity Section */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">
            YouTube Popularity
          </h2>
          <YoutubePopularity />
        </div>

        {/* Trend Analyzer Section */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">Trend Analysis</h2>
          <TrendAnalyzer />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 sm:mt-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">
              Top 20 Cryptocurrencies
            </h2>
            <CryptoList />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-gray-100 section-title">Trending Now</h2>
            <TrendingCoins />
          </div>
        </div>
      </div>
    </main>
  )
}
