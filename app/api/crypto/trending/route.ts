import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// Fetch trending cryptocurrencies from CoinGecko API
export async function GET() {
  try {
    // Fetch trending coins
    const response = await fetch("https://api.coingecko.com/api/v3/search/trending", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Get price data for the trending coins
    const coinIds = data.coins.map((item) => item.item.id).join(",")
    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!priceResponse.ok) {
      throw new Error(`CoinGecko API price error: ${priceResponse.status}`)
    }

    const priceData = await priceResponse.json()

    // Transform the data to match our app's structure
    const formattedData = data.coins.slice(0, 5).map((coin) => {
      const item = coin.item
      const price = priceData[item.id]?.usd || 0

      return {
        id: item.id,
        name: item.name,
        symbol: item.symbol,
        price: price,
        // Randomly assign sentiment for demo purposes
        sentiment: Math.random() > 0.5 ? "bullish" : "bearish",
        image: item.large,
        hotTopic: Math.random() > 0.7, // Randomly mark some as hot topics
      }
    })

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching trending cryptocurrency data:", error)
    return NextResponse.json({ error: "Failed to fetch trending cryptocurrency data" }, { status: 500 })
  }
}
