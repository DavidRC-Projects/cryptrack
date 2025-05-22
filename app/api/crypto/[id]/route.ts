import { NextResponse } from "next/server"

// Fetch detailed data for a specific cryptocurrency
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Fetch detailed data for the specific coin
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
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

    const data = await response.json()

    // Transform the data to match our app's structure
    const formattedData = {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      currentPrice: data.market_data.current_price.usd,
      gbpPrice: data.market_data.current_price.gbp,
      priceChangePercentage24h: data.market_data.price_change_percentage_24h,
      priceChangePercentage7d: data.market_data.price_change_percentage_7d,
      priceChangePercentage30d: data.market_data.price_change_percentage_30d,
      marketCap: data.market_data.market_cap.usd,
      gbpMarketCap: data.market_data.market_cap.gbp,
      image: data.image.large,
      // Generate a random sentiment score for demo purposes
      sentimentScore: Math.floor(Math.random() * 100),
      description: data.description.en,
      websiteUrl: data.links.homepage[0] || null,
      twitterUrl: data.links.twitter_screen_name ? `https://twitter.com/${data.links.twitter_screen_name}` : null,
      redditUrl: data.links.subreddit_url || null,
      githubUrl: data.links.repos_url.github[0] || null,
      allTimeHigh: data.market_data.ath.usd,
      gbpAllTimeHigh: data.market_data.ath.gbp,
      allTimeHighDate: data.market_data.ath_date.usd,
      circulatingSupply: data.market_data.circulating_supply,
      maxSupply: data.market_data.max_supply,
      volumeUsd24h: data.market_data.total_volume.usd,
      volumeGbp24h: data.market_data.total_volume.gbp,
      marketCapRank: data.market_cap_rank,
      // Generate mock news for demo purposes
      // In a real app, this would come from a news API
      news: [
        {
          id: 1,
          title: `Major Development for ${data.name} Ecosystem`,
          source: "CryptoNews",
          date: new Date().toISOString(),
          sentiment: "positive",
        },
        {
          id: 2,
          title: `${data.name} Price Analysis: Technical Indicators Point to Potential Breakout`,
          source: "CoinAnalyst",
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          sentiment: "positive",
        },
        {
          id: 3,
          title: `Regulatory Concerns Grow for ${data.name} in Asian Markets`,
          source: "BlockchainToday",
          date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          sentiment: "negative",
        },
      ],
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error(`Error fetching data for cryptocurrency ${params.id}:`, error)
    return NextResponse.json({ error: `Failed to fetch data for cryptocurrency ${params.id}` }, { status: 500 })
  }
}
