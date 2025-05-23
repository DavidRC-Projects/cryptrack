import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // In a real app, this would fetch data from the YouTube API
    // Since we don't have YouTube API access, we'll simulate realistic data

    // First, fetch the top cryptocurrencies to get their names and IDs
    const cryptoResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1",
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 3600 }, // Revalidate hourly
      },
    )

    if (!cryptoResponse.ok) {
      throw new Error(`CoinGecko API error: ${cryptoResponse.status}`)
    }

    const cryptoData = await cryptoResponse.json()

    // Generate simulated YouTube stats for each cryptocurrency
    const youtubeStats = cryptoData.map((crypto) => {
      // Base video count on market cap rank with some randomness
      // Higher ranked coins (Bitcoin, Ethereum) will have more videos
      const rankFactor = Math.max(1, 21 - crypto.market_cap_rank) // Invert rank (1 becomes 20, 20 becomes 1)
      const baseVideoCount = rankFactor * 15 // Base count scaled by rank
      const randomFactor = 0.7 + Math.random() * 0.6 // Random factor between 0.7 and 1.3

      // Calculate video metrics
      const videoCount24h = Math.floor(baseVideoCount * randomFactor)
      const avgViewsPerVideo = Math.floor((500000 / crypto.market_cap_rank) * (0.8 + Math.random() * 0.4))
      const totalViews24h = videoCount24h * avgViewsPerVideo

      // Determine if trending based on a combination of factors
      const isTrending =
        videoCount24h > 100 || // Many videos
        avgViewsPerVideo > 100000 || // High average views
        Math.random() > 0.8 // Random chance for smaller coins

      // Generate sentiment analysis
      // Higher ranked coins tend to have more positive sentiment
      const baseSentiment = 50 + rankFactor * 1.5
      const sentiment = Math.min(95, Math.max(20, baseSentiment + (Math.random() * 30 - 15)))

      // Generate engagement metrics
      const likesRatio = 0.6 + Math.random() * 0.3 // 60-90% like ratio
      const commentCount = Math.floor(totalViews24h * (0.002 + Math.random() * 0.003)) // 0.2-0.5% comment rate

      // Generate growth metrics (compared to previous week)
      const viewsGrowthPercent = Math.floor(Math.random() * 200 - 50) // -50% to +150%

      return {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        image: crypto.image,
        marketCapRank: crypto.market_cap_rank,
        youtubeMetrics: {
          videoCount24h,
          totalViews24h,
          avgViewsPerVideo,
          isTrending,
          sentiment,
          engagement: {
            likesRatio,
            commentCount,
          },
          growth: {
            viewsGrowthPercent,
          },
          topVideoTitles: generateVideoTitles(crypto.name, crypto.symbol, sentiment),
        },
      }
    })

    // Sort by total views (most popular first)
    youtubeStats.sort((a, b) => b.youtubeMetrics.totalViews24h - a.youtubeMetrics.totalViews24h)

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      data: youtubeStats,
      disclaimer:
        "This data is simulated and for demonstration purposes only. In a production environment, this would use the actual YouTube API.",
    })
  } catch (error) {
    console.error("Error generating YouTube stats:", error)
    return NextResponse.json({ error: "Failed to generate YouTube statistics" }, { status: 500 })
  }
}

// Helper function to generate realistic video titles
function generateVideoTitles(coinName, coinSymbol, sentiment) {
  const bullishTitles = [
    `Why ${coinName} Will EXPLODE in 2024! 🚀`,
    `${coinSymbol.toUpperCase()} Price Prediction - $100K Soon?`,
    `URGENT: ${coinName} Ready for MASSIVE Breakout!`,
    `${coinSymbol.toUpperCase()} Analysis - The Next 100x Gem?`,
    `Why I'm ALL IN on ${coinName} Right Now!`,
  ]

  const bearishTitles = [
    `WARNING: ${coinName} Could CRASH - Sell Now?`,
    `${coinSymbol.toUpperCase()} Price Analysis - Danger Ahead!`,
    `Why I Sold All My ${coinName} - Red Flags Explained`,
    `${coinSymbol.toUpperCase()} Technical Analysis - Bearish Pattern Forming`,
    `Is ${coinName} a SCAM? The Truth Revealed`,
  ]

  const neutralTitles = [
    `${coinName} Complete Guide 2024 - Everything You Need to Know`,
    `${coinSymbol.toUpperCase()} vs Competitors - Detailed Comparison`,
    `${coinName} Technical Analysis - Key Levels to Watch`,
    `What's Next for ${coinSymbol.toUpperCase()}? Expert Opinions`,
    `${coinName} Fundamentals Explained - Worth Investing?`,
  ]

  // Select titles based on sentiment
  let titles = []
  if (sentiment > 70) {
    // Mostly bullish with some neutral
    titles = [...bullishTitles.slice(0, 3), ...neutralTitles.slice(0, 2)]
  } else if (sentiment < 40) {
    // Mostly bearish with some neutral
    titles = [...bearishTitles.slice(0, 3), ...neutralTitles.slice(0, 2)]
  } else {
    // Mixed sentiment
    titles = [...neutralTitles.slice(0, 2), bullishTitles[0], bearishTitles[0], neutralTitles[2]]
  }

  // Shuffle the array
  return titles.sort(() => Math.random() - 0.5)
}
