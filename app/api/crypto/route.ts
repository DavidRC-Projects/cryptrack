import { NextResponse } from "next/server"

// Fetch top cryptocurrencies from CoinGecko API
export async function GET() {
  try {
    // Fetch top 20 cryptocurrencies by market cap in both USD and GBP
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h",
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      },
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const usdData = await response.json()

    // Fetch the same coins in GBP
    const gbpResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h",
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      },
    )

    if (!gbpResponse.ok) {
      throw new Error(`CoinGecko API error for GBP: ${gbpResponse.status}`)
    }

    const gbpData = await gbpResponse.json()

    // Create a map of GBP prices by coin id
    const gbpPriceMap = {}
    gbpData.forEach((coin) => {
      gbpPriceMap[coin.id] = {
        currentPrice: coin.current_price,
        marketCap: coin.market_cap,
        totalVolume: coin.total_volume,
      }
    })

    // Transform the data to match our app's structure with both currencies
    const formattedData = usdData.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      currentPrice: coin.current_price,
      priceChangePercentage24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      image: coin.image,
      // Add GBP prices
      gbpPrice: gbpPriceMap[coin.id]?.currentPrice || 0,
      gbpMarketCap: gbpPriceMap[coin.id]?.marketCap || 0,
      gbpVolume: gbpPriceMap[coin.id]?.totalVolume || 0,
      // Generate a random sentiment score for demo purposes
      sentimentScore: Math.floor(Math.random() * 100),
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error)
    return NextResponse.json({ error: "Failed to fetch cryptocurrency data" }, { status: 500 })
  }
}
