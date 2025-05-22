"use client"

import { useState, useEffect } from "react"
import { Search, RefreshCw } from "lucide-react"
import { fetchCryptoData } from "@/lib/crypto-api"
import { CryptoCard } from "@/components/crypto-card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CryptoList() {
  const [cryptos, setCryptos] = useState([])
  const [filteredCryptos, setFilteredCryptos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = async () => {
    try {
      setIsLoading(true)
      const data = await fetchCryptoData()
      setCryptos(data)
      setFilteredCryptos(
        searchTerm
          ? data.filter(
              (crypto) =>
                crypto.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                crypto.symbol?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
          : data,
      )
      setError(null)
    } catch (err) {
      console.error("Failed to fetch crypto data:", err)
      setError("Failed to load cryptocurrency data. Please try again later.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchTerm && cryptos.length > 0) {
      const filtered = cryptos.filter(
        (crypto) =>
          crypto.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.symbol?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCryptos(filtered)
    } else {
      setFilteredCryptos(cryptos)
    }
  }, [searchTerm, cryptos])

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadData()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="bg-red-900/50 border-red-800/50 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Try Again"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Filter cryptocurrencies..."
            className="pl-10 bg-slate-800/50 border-slate-700/50 text-white h-11 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="icon"
          disabled={isRefreshing}
          className="h-11 w-11 bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>

      <div className="space-y-4">
        {filteredCryptos.length > 0 ? (
          filteredCryptos.map((crypto) => <CryptoCard key={crypto.id} crypto={crypto} />)
        ) : (
          <div className="text-center py-8 text-gray-300 bg-slate-850/50 rounded-lg p-6">
            No cryptocurrencies found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
