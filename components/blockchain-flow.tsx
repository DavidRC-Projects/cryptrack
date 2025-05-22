"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import dynamic from "next/dynamic"
import {
  Zap,
  RefreshCw,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

// Dynamically import ForceGraph2D with SSR disabled
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-900/50">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  ),
})

// Define types for our graph data
type GraphNode = {
  id: string
  group: number
  label: string
  val: number
}

type GraphLink = {
  source: string
  target: string
  value: number
  type: string
}

type GraphData = {
  nodes: GraphNode[]
  links: GraphLink[]
}

export function BlockchainFlow() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedChain, setSelectedChain] = useState("ethereum")
  const [timeframe, setTimeframe] = useState("24h")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [
      { id: "binance", group: 1, label: "Binance", val: 20 },
      { id: "coinbase", group: 1, label: "Coinbase", val: 15 },
      { id: "kraken", group: 1, label: "Kraken", val: 10 },
      { id: "ftx", group: 1, label: "FTX", val: 8 },
      { id: "whale1", group: 2, label: "Whale 1", val: 12 },
      { id: "whale2", group: 2, label: "Whale 2", val: 10 },
      { id: "whale3", group: 2, label: "Whale 3", val: 8 },
      { id: "whale4", group: 2, label: "Whale 4", val: 7 },
      { id: "dex1", group: 3, label: "Uniswap", val: 14 },
      { id: "dex2", group: 3, label: "SushiSwap", val: 9 },
      { id: "lending1", group: 4, label: "Aave", val: 11 },
      { id: "lending2", group: 4, label: "Compound", val: 10 },
    ],
    links: [
      { source: "binance", target: "whale1", value: 5000000, type: "outflow" },
      { source: "whale1", target: "dex1", value: 3000000, type: "outflow" },
      { source: "dex1", target: "whale2", value: 2000000, type: "outflow" },
      { source: "whale2", target: "lending1", value: 1500000, type: "outflow" },
      { source: "coinbase", target: "whale3", value: 4000000, type: "outflow" },
      { source: "whale3", target: "dex2", value: 2500000, type: "outflow" },
      { source: "dex2", target: "whale4", value: 1800000, type: "outflow" },
      { source: "whale4", target: "lending2", value: 1200000, type: "outflow" },
      { source: "kraken", target: "whale2", value: 3000000, type: "outflow" },
      { source: "whale1", target: "ftx", value: 1000000, type: "outflow" },
    ],
  })

  // Function to fetch blockchain flow data
  const fetchBlockchainData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // In a real app, this would be an API call to get real data
      // For now, we'll simulate an API call with a timeout
      const response = await new Promise<GraphData>((resolve) => {
        setTimeout(() => {
          // Simulate random data changes
          const newData: GraphData = {
            nodes: graphData.nodes.map(node => ({
              ...node,
              val: node.val * (0.9 + Math.random() * 0.2) // Random variation of ±10%
            })),
            links: graphData.links.map(link => ({
              ...link,
              value: link.value * (0.9 + Math.random() * 0.2) // Random variation of ±10%
            }))
          }
          resolve(newData)
        }, 1000)
      })

      setGraphData(response)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching blockchain data:', err)
      setError('Failed to fetch latest data. Showing previous data.')
      // Don't update the data, keep showing the previous state
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchBlockchainData()
  }, [selectedChain, timeframe]) // Refetch when chain or timeframe changes

  const handleRefresh = () => {
    fetchBlockchainData()
  }

  // Calculate total flows
  const exchangeOutflow = graphData.links
    .filter(
      (link) =>
        ["binance", "coinbase", "kraken", "ftx"].includes(link.source) &&
        !["binance", "coinbase", "kraken", "ftx"].includes(link.target),
    )
    .reduce((sum, link) => sum + link.value, 0)

  const exchangeInflow = graphData.links
    .filter(
      (link) =>
        !["binance", "coinbase", "kraken", "ftx"].includes(link.source) &&
        ["binance", "coinbase", "kraken", "ftx"].includes(link.target),
    )
    .reduce((sum, link) => sum + link.value, 0)

  const netFlow = exchangeInflow - exchangeOutflow

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-medium text-gray-200 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            Blockchain Flow Visualizer
          </CardTitle>
          <CardDescription className="text-gray-400">
            Visualize fund flows between exchanges, wallets and protocols
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select 
            value={selectedChain} 
            onValueChange={(value) => {
              setSelectedChain(value)
              // Chain change will trigger useEffect
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-36 h-8 bg-slate-800/50 border-slate-700/50 text-sm">
              <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="bitcoin">Bitcoin</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
              <SelectItem value="avalanche">Avalanche</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={timeframe} 
            onValueChange={(value) => {
              setTimeframe(value)
              // Timeframe change will trigger useEffect
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-24 h-8 bg-slate-800/50 border-slate-700/50 text-sm">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleRefresh} 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {error && (
          <Alert className="bg-yellow-900/20 border-yellow-800/50 mb-5 text-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Alert className="bg-slate-800/50 border-slate-700/50 mb-5 text-gray-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Significant outflows from exchanges to private wallets often indicate accumulation, while large inflows to
            exchanges may signal selling pressure.
            {lastUpdated && (
              <span className="block mt-1 text-xs text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-800/30 p-4 rounded-lg flex items-center">
            <div className="rounded-full p-3 bg-red-500/20 text-red-400 mr-3">
              <ArrowUpFromLine className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Exchange Outflows</div>
              <div className="text-xl font-medium">${(exchangeOutflow / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-red-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.3% vs. previous period
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-4 rounded-lg flex items-center">
            <div className="rounded-full p-3 bg-green-500/20 text-green-400 mr-3">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Exchange Inflows</div>
              <div className="text-xl font-medium">${(exchangeInflow / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-red-400 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -8.7% vs. previous period
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-4 rounded-lg flex items-center">
            <div
              className={`rounded-full p-3 ${netFlow < 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"} mr-3`}
            >
              {netFlow < 0 ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            </div>
            <div>
              <div className="text-sm text-gray-400">Net Exchange Flow</div>
              <div className={`text-xl font-medium ${netFlow < 0 ? "text-green-400" : "text-red-400"}`}>
                ${Math.abs(netFlow / 1000000).toFixed(1)}M {netFlow < 0 ? "Outflow" : "Inflow"}
              </div>
              <div className="text-xs text-gray-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Updated 5 minutes ago
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-200">Flow Network Visualization</h3>
            <div className="flex gap-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Exchanges</Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Whales</Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">DEXs</Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Lending</Badge>
            </div>
          </div>

          <div className="h-[300px] sm:h-[500px] w-full bg-slate-900/50 rounded-lg overflow-hidden">
            <ForceGraph2D
              graphData={graphData}
              nodeAutoColorBy="group"
              nodeLabel={(node) => `${node.label}: ${node.val}M`}
              linkWidth={(link) => Math.sqrt(link.value) * 0.00004}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={0.65}
              cooldownTicks={100}
              linkColor={() => "#88888855"}
              backgroundColor="rgba(0,0,0,0)"
            />
          </div>
        </div>

        <div className="bg-slate-800/30 p-4 rounded-lg">
          <h3 className="font-medium text-gray-200 mb-3">Notable Flows (Last 24 Hours)</h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-700/30 p-3 rounded-lg">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">LARGE OUTFLOW</Badge>
                <div>
                  <div className="text-sm font-medium">Binance → Unknown Wallet</div>
                  <div className="text-xs text-gray-400">5,000 ETH ($12.5M)</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">3 hours ago</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-700/30 p-3 rounded-lg">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">STAKING</Badge>
                <div>
                  <div className="text-sm font-medium">Whale Wallet → Lido</div>
                  <div className="text-xs text-gray-400">2,200 ETH ($5.5M)</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">6 hours ago</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-700/30 p-3 rounded-lg">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">DEX SWAP</Badge>
                <div>
                  <div className="text-sm font-medium">Uniswap → Multiple Wallets</div>
                  <div className="text-xs text-gray-400">$8.3M USDC → ETH</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">12 hours ago</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
