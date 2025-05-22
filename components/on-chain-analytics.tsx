"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart2, Info, AlertTriangle, Zap } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RPieChart,
  Pie,
  Cell,
} from "recharts"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for different on-chain metrics
const defiTVLData = [
  { date: "2023-05", ethereum: 28.5, solana: 2.4, avalanche: 1.2, polygon: 1.8, bsc: 5.6 },
  { date: "2023-06", ethereum: 30.2, solana: 2.8, avalanche: 1.5, polygon: 2.1, bsc: 5.9 },
  { date: "2023-07", ethereum: 32.6, solana: 3.2, avalanche: 1.7, polygon: 2.3, bsc: 6.2 },
  { date: "2023-08", ethereum: 35.1, solana: 3.6, avalanche: 2.0, polygon: 2.6, bsc: 6.5 },
  { date: "2023-09", ethereum: 33.4, solana: 3.4, avalanche: 1.9, polygon: 2.5, bsc: 6.3 },
  { date: "2023-10", ethereum: 36.8, solana: 4.1, avalanche: 2.3, polygon: 2.8, bsc: 6.7 },
  { date: "2023-11", ethereum: 38.5, solana: 4.5, avalanche: 2.6, polygon: 3.0, bsc: 7.0 },
  { date: "2023-12", ethereum: 40.2, solana: 4.9, avalanche: 2.8, polygon: 3.2, bsc: 7.3 },
  { date: "2024-01", ethereum: 42.8, solana: 5.3, avalanche: 3.0, polygon: 3.4, bsc: 7.5 },
  { date: "2024-02", ethereum: 45.1, solana: 5.8, avalanche: 3.2, polygon: 3.6, bsc: 7.8 },
  { date: "2024-03", ethereum: 43.5, solana: 6.2, avalanche: 3.5, polygon: 3.8, bsc: 8.0 },
  { date: "2024-04", ethereum: 46.9, solana: 7.5, avalanche: 3.7, polygon: 4.0, bsc: 8.2 },
  { date: "2024-05", ethereum: 49.3, solana: 8.9, avalanche: 4.0, polygon: 4.2, bsc: 8.5 },
]

const dexVolumeData = [
  { date: "2023-11", uniswap: 35.2, pancakeswap: 18.5, curve: 12.3, sushiswap: 7.8, others: 26.2 },
  { date: "2023-12", uniswap: 38.6, pancakeswap: 19.2, curve: 13.5, sushiswap: 8.1, others: 20.6 },
  { date: "2024-01", uniswap: 40.1, pancakeswap: 21.3, curve: 14.2, sushiswap: 7.5, others: 16.9 },
  { date: "2024-02", uniswap: 42.5, pancakeswap: 22.8, curve: 15.0, sushiswap: 6.9, others: 12.8 },
  { date: "2024-03", uniswap: 44.2, pancakeswap: 21.5, curve: 16.3, sushiswap: 7.2, others: 10.8 },
  { date: "2024-04", uniswap: 46.8, pancakeswap: 23.2, curve: 17.5, sushiswap: 7.8, others: 4.7 },
  { date: "2024-05", uniswap: 48.3, pancakeswap: 24.5, curve: 18.9, sushiswap: 8.3, others: 0 },
]

const gasData = [
  { date: "2024-04-28", eth: 25, arbitrum: 0.15, optimism: 0.18, polygon: 0.05, base: 0.12 },
  { date: "2024-04-29", eth: 32, arbitrum: 0.18, optimism: 0.22, polygon: 0.06, base: 0.15 },
  { date: "2024-04-30", eth: 28, arbitrum: 0.16, optimism: 0.2, polygon: 0.05, base: 0.14 },
  { date: "2024-05-01", eth: 35, arbitrum: 0.19, optimism: 0.24, polygon: 0.07, base: 0.16 },
  { date: "2024-05-02", eth: 42, arbitrum: 0.22, optimism: 0.28, polygon: 0.08, base: 0.19 },
  { date: "2024-05-03", eth: 30, arbitrum: 0.17, optimism: 0.21, polygon: 0.06, base: 0.15 },
  { date: "2024-05-04", eth: 26, arbitrum: 0.15, optimism: 0.19, polygon: 0.05, base: 0.13 },
  { date: "2024-05-05", eth: 29, arbitrum: 0.16, optimism: 0.21, polygon: 0.06, base: 0.14 },
  { date: "2024-05-06", eth: 33, arbitrum: 0.18, optimism: 0.23, polygon: 0.07, base: 0.16 },
  { date: "2024-05-07", eth: 38, arbitrum: 0.2, optimism: 0.25, polygon: 0.08, base: 0.18 },
  { date: "2024-05-08", eth: 31, arbitrum: 0.17, optimism: 0.22, polygon: 0.06, base: 0.15 },
  { date: "2024-05-09", eth: 27, arbitrum: 0.16, optimism: 0.2, polygon: 0.05, base: 0.14 },
  { date: "2024-05-10", eth: 30, arbitrum: 0.17, optimism: 0.21, polygon: 0.06, base: 0.15 },
  { date: "2024-05-11", eth: 34, arbitrum: 0.19, optimism: 0.24, polygon: 0.07, base: 0.17 },
]

const nftMarketShare = [
  { name: "OpenSea", value: 45 },
  { name: "Blur", value: 32 },
  { name: "X2Y2", value: 8 },
  { name: "Magic Eden", value: 10 },
  { name: "Others", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function OnChainAnalytics() {
  const [selectedChain, setSelectedChain] = useState("all")
  const [selectedMetric, setSelectedMetric] = useState("tvl")
  const [timeframe, setTimeframe] = useState("1y")

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:gap-2">
          <div>
            <CardTitle className="text-xl font-medium text-gray-200 flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              On-Chain Analytics
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time blockchain metrics and ecosystem insights
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-36 h-8 bg-slate-800/50 border-slate-700/50 text-sm">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Chains</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="bsc">BSC</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="avalanche">Avalanche</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-24 h-8 bg-slate-800/50 border-slate-700/50 text-sm">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="1w">1W</SelectItem>
                <SelectItem value="1m">1M</SelectItem>
                <SelectItem value="3m">3M</SelectItem>
                <SelectItem value="1y">1Y</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Alert className="bg-slate-800/50 border-slate-700/50 mb-5 text-gray-300">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            On-chain data provides objective insights into blockchain usage and adoption that often precede price
            movements.
          </AlertDescription>
        </Alert>

        <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="mb-4">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 bg-slate-850/70">
            <TabsTrigger value="tvl" className="text-xs sm:text-sm">
              DeFi TVL
            </TabsTrigger>
            <TabsTrigger value="dex" className="text-xs sm:text-sm">
              DEX Volume
            </TabsTrigger>
            <TabsTrigger value="gas" className="text-xs sm:text-sm">
              Gas Metrics
            </TabsTrigger>
            <TabsTrigger value="nft" className="text-xs sm:text-sm">
              NFT Market
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="bg-slate-800/30 p-4 rounded-lg">
          {selectedMetric === "tvl" && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center mb-3">
                <h3 className="font-medium text-gray-200 mb-2 sm:mb-0">Total Value Locked in DeFi (Billions USD)</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+4.8% monthly growth</Badge>
              </div>
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={defiTVLData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#E5E7EB" }}
                      formatter={(value) => [`$${value}B`, ""]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="ethereum" stroke="#10B981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="solana" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="avalanche" stroke="#ff0000" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="polygon" stroke="#ffc658" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="bsc" stroke="#00C49F" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-2 text-center">
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Ethereum</div>
                  <div className="text-lg font-medium text-green-500">$49.3B</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Solana</div>
                  <div className="text-lg font-medium text-purple-500">$8.9B</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Avalanche</div>
                  <div className="text-lg font-medium text-red-500">$4.0B</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Polygon</div>
                  <div className="text-lg font-medium text-yellow-500">$4.2B</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">BSC</div>
                  <div className="text-lg font-medium text-teal-500">$8.5B</div>
                </div>
              </div>
              <Alert className="bg-yellow-900/20 border-yellow-800/50 text-yellow-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Insight:</strong> Solana's TVL has increased 48% over the past 2 months, signaling strong
                  fundamental growth that typically precedes price appreciation.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {selectedMetric === "dex" && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center mb-3">
                <h3 className="font-medium text-gray-200 mb-2 sm:mb-0">DEX Trading Volume (Billions USD)</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+8.2% monthly growth</Badge>
              </div>
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dexVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#E5E7EB" }}
                      formatter={(value) => [`$${value}B`, ""]}
                    />
                    <Legend />
                    <Bar dataKey="uniswap" stackId="a" fill="#10B981" />
                    <Bar dataKey="pancakeswap" stackId="a" fill="#8884d8" />
                    <Bar dataKey="curve" stackId="a" fill="#ff0000" />
                    <Bar dataKey="sushiswap" stackId="a" fill="#ffc658" />
                    <Bar dataKey="others" stackId="a" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-2 text-center">
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Uniswap</div>
                  <div className="text-lg font-medium text-green-500">$48.3B</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">PancakeSwap</div>
                  <div className="text-lg font-medium text-purple-500">$24.5B</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Curve</div>
                  <div className="text-lg font-medium text-red-500">$18.9B</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">SushiSwap</div>
                  <div className="text-lg font-medium text-yellow-500">$8.3B</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Total</div>
                  <div className="text-lg font-medium text-blue-500">$100.0B</div>
                </div>
              </div>
              <Alert className="bg-yellow-900/20 border-yellow-800/50 text-yellow-200">
                <Zap className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Insight:</strong> Uniswap's dominance continues to grow, now capturing 48.3% of DEX volume.
                  The UNI token typically follows volume trends with a 2-3 week lag.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {selectedMetric === "gas" && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center mb-3">
                <h3 className="font-medium text-gray-200 mb-2 sm:mb-0">Gas Price Comparison (Gwei)</h3>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">+18% Ethereum gas increase</Badge>
              </div>
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gasData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#E5E7EB" }}
                      formatter={(value, name) => [name === "eth" ? `${value} gwei` : `$${value.toFixed(2)}`, name]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="eth" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="arbitrum" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="optimism" stroke="#ff0000" strokeWidth={2} />
                    <Line type="monotone" dataKey="polygon" stroke="#ffc658" strokeWidth={2} />
                    <Line type="monotone" dataKey="base" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-2 text-center">
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Ethereum</div>
                  <div className="text-lg font-medium text-green-500">34 gwei</div>
                  <div className="text-xs text-red-400">High</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Arbitrum</div>
                  <div className="text-lg font-medium text-purple-500">$0.19</div>
                  <div className="text-xs text-green-400">Low</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Optimism</div>
                  <div className="text-lg font-medium text-red-500">$0.24</div>
                  <div className="text-xs text-green-400">Low</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Polygon</div>
                  <div className="text-lg font-medium text-yellow-500">$0.07</div>
                  <div className="text-xs text-green-400">Very Low</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">Base</div>
                  <div className="text-lg font-medium text-teal-500">$0.17</div>
                  <div className="text-xs text-green-400">Low</div>
                </div>
              </div>
              <Alert className="bg-yellow-900/20 border-yellow-800/50 text-yellow-200">
                <Zap className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Insight:</strong> Rising Ethereum gas prices indicate increasing network activity, often a
                  bullish signal. Consider Layer 2s for cost-effective transactions.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {selectedMetric === "nft" && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center mb-3">
                <h3 className="font-medium text-gray-200 mb-2 sm:mb-0">NFT Marketplace Share (Volume)</h3>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">$142M weekly volume</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie
                        data={nftMarketShare}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {nftMarketShare.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#E5E7EB" }}
                        formatter={(value) => [`${value}%`, ""]}
                      />
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-2">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Top Collections (24h)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                          <span className="text-xs font-bold text-blue-400">1</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Bored Ape Yacht Club</div>
                          <div className="text-xs text-gray-400">Floor: 32.5 ETH</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">$1.2M</div>
                        <div className="text-xs text-green-400">+12.3%</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                          <span className="text-xs font-bold text-blue-400">2</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Azuki</div>
                          <div className="text-xs text-gray-400">Floor: 11.2 ETH</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">$842K</div>
                        <div className="text-xs text-green-400">+8.7%</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                          <span className="text-xs font-bold text-blue-400">3</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Pudgy Penguins</div>
                          <div className="text-xs text-gray-400">Floor: 6.8 ETH</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">$615K</div>
                        <div className="text-xs text-red-400">-3.2%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Alert className="bg-yellow-900/20 border-yellow-800/50 text-yellow-200">
                <Zap className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Insight:</strong> NFT market volume is showing signs of recovery with a 28% increase
                  month-over-month, potentially signaling the beginning of a new cycle for digital collectibles.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
