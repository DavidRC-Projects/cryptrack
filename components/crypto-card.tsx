import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CryptoCard({ crypto }) {
  // Handle potential null or undefined values
  const priceChangePercentage24h = crypto.priceChangePercentage24h || 0
  const priceChangeColor = priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"

  const sentimentScore = crypto.sentimentScore || 50
  const sentimentColor =
    sentimentScore > 70
      ? "bg-green-500 text-white"
      : sentimentScore < 30
        ? "bg-red-500 text-white"
        : "bg-yellow-500 text-slate-950"

  const sentimentLabel = sentimentScore > 70 ? "Bullish" : sentimentScore < 30 ? "Bearish" : "Neutral"

  return (
    <Card className="glass-card hover:shadow-card transition-all duration-300 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shadow-md">
              {crypto.image ? (
                <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-10 h-10" />
              ) : (
                <div className="text-xl font-bold">{crypto.symbol?.charAt(0)}</div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{crypto.name}</h3>
                <span className="text-gray-400 text-sm">{crypto.symbol?.toUpperCase()}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-medium">${(crypto.currentPrice || 0).toLocaleString()}</span>
                  <span className="text-sm text-gray-400">/ £{(crypto.gbpPrice || 0).toLocaleString()}</span>
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

          <div className="flex flex-col items-end gap-2">
            <Badge className={`${sentimentColor} font-medium px-3 py-1`}>{sentimentLabel}</Badge>
            <Link href={`/crypto/${crypto.id}`}>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-slate-800">
                Details <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
