"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, RefreshCw, Zap, Building, CheckCircle, Info } from "lucide-react"
import Link from "next/link"

// This would be fetched from an API in a real implementation
const UTILITY_TOKENS = [
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    category: "Oracle",
    description:
      "Chainlink is a decentralized oracle network that provides real-world data to smart contracts on the blockchain. It allows smart contracts to securely connect to external data sources, APIs, and payment systems.",
    partnerships: ["Google Cloud", "SWIFT", "Oracle", "Associated Press", "AccuWeather"],
    realWorldUsage: [
      "Price feeds for DeFi protocols",
      "Random number generation for gaming",
      "Weather data for parametric insurance",
      "Sports data for prediction markets",
    ],
    onChainMetrics: {
      activeNodes: 284,
      totalValueSecured: "$15.7B",
      dailyTransactions: 125000,
      weeklyGrowth: 3.2,
    },
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    category: "Layer 2 / Scaling",
    description:
      "Polygon is a protocol and framework for building and connecting Ethereum-compatible blockchain networks. It aims to address Ethereum's limitations by providing faster and cheaper transactions through Layer 2 scaling solutions.",
    partnerships: ["Disney", "Starbucks", "Reddit", "Meta", "Adidas"],
    realWorldUsage: ["NFT marketplaces", "Gaming platforms", "DeFi applications", "Enterprise blockchain solutions"],
    onChainMetrics: {
      activeAddresses: "2.3M",
      dailyTransactions: "3.1M",
      totalApps: 37000,
      weeklyGrowth: 1.8,
    },
  },
  {
    id: "filecoin",
    name: "Filecoin",
    symbol: "FIL",
    image: "https://assets.coingecko.com/coins/images/12817/large/filecoin.png",
    category: "Storage",
    description:
      "Filecoin is a decentralized storage network designed to store humanity's most important information. It provides a marketplace for users to rent out their unused hard drive space and for others to store their data in a secure and decentralized manner.",
    partnerships: ["Protocol Labs", "Lockheed Martin", "Harvard Library", "Internet Archive"],
    realWorldUsage: [
      "Decentralized cloud storage",
      "NFT metadata storage",
      "Scientific data preservation",
      "Content delivery networks",
    ],
    onChainMetrics: {
      storageCapacity: "18.9 EiB",
      activeDeals: "1.2M",
      activeProviders: 4200,
      weeklyGrowth: 2.5,
    },
  },
  {
    id: "the-graph",
    name: "The Graph",
    symbol: "GRT",
    image: "https://assets.coingecko.com/coins/images/13397/large/Graph_Token.png",
    category: "Data Indexing",
    description:
      "The Graph is an indexing protocol for querying networks like Ethereum and IPFS. It allows developers to build and publish open APIs, called subgraphs, making data easily accessible for applications.",
    partnerships: ["Uniswap", "Synthetix", "Aave", "Decentraland", "Ethereum Foundation"],
    realWorldUsage: [
      "DeFi analytics platforms",
      "Dapp data querying",
      "NFT marketplace data",
      "DAO governance metrics",
    ],
    onChainMetrics: {
      subgraphs: 38000,
      queryVolume: "5.2B monthly",
      indexers: 190,
      weeklyGrowth: 4.1,
    },
  },
  {
    id: "vechain",
    name: "VeChain",
    symbol: "VET",
    image: "https://assets.coingecko.com/coins/images/1167/large/VeChain-Logo-768x725.png",
    category: "Supply Chain",
    description:
      "VeChain is a blockchain platform designed to enhance supply chain management and business processes. It aims to streamline these processes and provide transparent information flow for complex supply chains.",
    partnerships: ["Walmart China", "BMW", "PwC", "DNV GL", "Shanghai Gas"],
    realWorldUsage: [
      "Food safety tracking",
      "Luxury goods authentication",
      "Carbon emission tracking",
      "Healthcare data management",
    ],
    onChainMetrics: {
      activeContracts: 1300,
      dailyTransactions: 115000,
      enterpriseUsers: 30,
      weeklyGrowth: 1.2,
    },
  },
]

export function UtilityTokenInsights() {
  const [selectedToken, setSelectedToken] = useState(UTILITY_TOKENS[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-medium text-gray-200 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            Utility Token Insights
          </CardTitle>
          <CardDescription className="text-gray-400">Tokens with real-world usage and partnerships</CardDescription>
        </div>
        <Button onClick={handleRefresh} variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <Alert className="bg-slate-800/50 border-slate-700/50 mb-5 text-gray-300">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Utility tokens power blockchain ecosystems and have real-world applications beyond speculation.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue={UTILITY_TOKENS[0].id}>
          <TabsList className="grid grid-cols-5 mb-5 bg-slate-850/70">
            {UTILITY_TOKENS.map((token) => (
              <TabsTrigger
                key={token.id}
                value={token.id}
                onClick={() => setSelectedToken(token)}
                className="text-xs sm:text-sm"
              >
                {token.symbol}
              </TabsTrigger>
            ))}
          </TabsList>

          {UTILITY_TOKENS.map((token) => (
            <TabsContent key={token.id} value={token.id}>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shadow-md">
                    <img src={token.image || "/placeholder.svg"} alt={token.name} className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{token.name}</h3>
                      <span className="text-gray-400 text-sm">{token.symbol}</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">{token.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{token.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Partnerships */}
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                      <Building className="h-4 w-4 mr-2 text-blue-400" />
                      Key Partnerships
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {token.partnerships.map((partner, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-800/30">
                          {partner}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Real-world Usage */}
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                      Real-world Applications
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {token.realWorldUsage.map((usage, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                          {usage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* On-chain Metrics */}
                <div className="bg-slate-800/30 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">On-chain Activity Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(token.onChainMetrics).map(([key, value], idx) => (
                      <div key={idx}>
                        <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                        <div className="text-lg font-medium text-primary">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm" asChild className="bg-slate-800/50 border-slate-700/50">
                    <Link
                      href={`https://www.coingecko.com/en/coins/${token.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View More Details
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4 text-sm text-gray-400">
          <p>
            <strong>Why utility tokens matter:</strong> Tokens with strong partnerships and actual usage tend to have
            more sustainable value propositions beyond market speculation.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
