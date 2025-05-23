import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// Top 20 cryptocurrencies by market cap
const TOP_CRYPTOS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "btc" },
  { id: "ethereum", name: "Ethereum", symbol: "eth" },
  { id: "binancecoin", name: "Binance Coin", symbol: "bnb" },
  { id: "solana", name: "Solana", symbol: "sol" },
  { id: "ripple", name: "XRP", symbol: "xrp" },
  { id: "cardano", name: "Cardano", symbol: "ada" },
  { id: "avalanche-2", name: "Avalanche", symbol: "avax" },
  { id: "dogecoin", name: "Dogecoin", symbol: "doge" },
  { id: "polkadot", name: "Polkadot", symbol: "dot" },
  { id: "chainlink", name: "Chainlink", symbol: "link" },
  { id: "tron", name: "TRON", symbol: "trx" },
  { id: "polygon", name: "Polygon", symbol: "matic" },
  { id: "litecoin", name: "Litecoin", symbol: "ltc" },
  { id: "cosmos", name: "Cosmos", symbol: "atom" },
  { id: "uniswap", name: "Uniswap", symbol: "uni" },
  { id: "monero", name: "Monero", symbol: "xmr" },
  { id: "stellar", name: "Stellar", symbol: "xlm" },
  { id: "ethereum-classic", name: "Ethereum Classic", symbol: "etc" },
  { id: "filecoin", name: "Filecoin", symbol: "fil" },
  { id: "near", name: "NEAR Protocol", symbol: "near" },
]

export async function GET() {
  try {
    // For a production application, we'd fetch this data from CoinGecko API
    // But we're using a static list to avoid rate limiting
    return NextResponse.json(TOP_CRYPTOS)
  } catch (error) {
    console.error("Error fetching cryptocurrency options:", error)
    return NextResponse.json({ error: "Failed to fetch cryptocurrency options" }, { status: 500 })
  }
}
