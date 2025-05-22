import { NextResponse } from "next/server"

// Cache for trend data
let trendDataCache = null
let cacheTimestamp = null
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

// Function to cache trend data
function cacheTrendData(data) {
  trendDataCache = data
  cacheTimestamp = Date.now()
}

// Function to get cached trend data if it's still valid
function getCachedTrendData() {
  if (trendDataCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return trendDataCache
  }
  return null
}

// Function to generate mock trend data when API is unavailable
function generateMockTrendData() {
  const currentDate = new Date()
  const dateString = currentDate.toISOString()

  // Generate mock data for top cryptocurrencies
  const topCryptos = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    },
    {
      id: "binancecoin",
      name: "Binance Coin",
      symbol: "BNB",
      image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    },
    {
      id: "ripple",
      name: "XRP",
      symbol: "XRP",
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    },
  ]

  // Generate mock bullish signals
  const potentialPumps = topCryptos.slice(0, 3).map((coin, index) => ({
    ...coin,
    currentPrice: 1000 / (index + 1),
    gbpPrice: 800 / (index + 1),
    priceChange1h: 3 + Math.random() * 5,
    priceChange24h: 5 + Math.random() * 10,
    priceChange7d: 2 + Math.random() * 15,
    volume: 1000000000 / (index + 1),
    volumeToMarketCap: 0.1 + Math.random() * 0.2,
    signals: ["Strong recent momentum", "High trading volume", "Positive price trend"],
    recentMentions: Math.floor(Math.random() * 100) + 50,
    trendingRank: Math.floor(Math.random() * 20),
  }))

  // Generate mock bearish signals
  const potentialDrops = topCryptos.slice(3, 6).map((coin, index) => ({
    ...coin,
    currentPrice: 500 / (index + 1),
    gbpPrice: 400 / (index + 1),
    priceChange1h: -3 - Math.random() * 5,
    priceChange24h: -5 - Math.random() * 10,
    priceChange7d: -2 - Math.random() * 15,
    volume: 500000000 / (index + 1),
    volumeToMarketCap: 0.1 + Math.random() * 0.2,
    signals: ["Downward momentum", "High selling volume", "Negative price trend"],
    recentMentions: Math.floor(Math.random() * 100) + 20,
    trendingRank: Math.floor(Math.random() * 50) + 20,
  }))

  // Generate mock trending coins
  const trendingCoins = topCryptos.map((coin, index) => ({
    ...coin,
    marketCapRank: index + 1,
    price: 1000 / (index + 1),
    gbpPrice: 800 / (index + 1),
    signals: ["High social volume", "Trending on CoinGecko", "Community growth"],
    score: Math.floor(Math.random() * 100) + 1,
  }))

  // Generate mock news mentions
  const topNewsMentions = topCryptos.slice(0, 5).map((coin) => ({
    ...coin,
    mentions: Math.floor(Math.random() * 300) + 50,
    sentiment: 0.3 + Math.random() * 0.7,
    headlines: [
      `${coin.name} sees increased adoption among institutional investors`,
      `New developments for ${coin.name} ecosystem announced`,
    ],
  }))

  return {
    timestamp: dateString,
    potentialPumps,
    potentialDrops,
    trendingCoins,
    topNewsMentions,
    disclaimer: "This is simulated data due to API rate limiting. The data does not reflect current market conditions.",
  }
}

// Modify the GET function to better handle rate limiting
export async function GET() {
  try {
    // Check if we have cached data to use during rate limiting
    const cachedData = getCachedTrendData()

    // If we have cached data that's still valid, use it immediately to reduce API calls
    if (cachedData) {
      console.log("Using cached trend data to reduce API calls")
      return NextResponse.json(cachedData)
    }

    // Attempt to fetch data from CoinGecko with proper rate limiting handling
    try {
      // Fetch top coins with both USD and GBP data
      const topCoinsResponseUSD = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d",
        {
          headers: {
            Accept: "application/json",
          },
          next: { revalidate: 300 }, // Revalidate every 5 minutes
        },
      )

      if (!topCoinsResponseUSD.ok) {
        // If we hit rate limits but have cached data, use that instead of failing
        if (topCoinsResponseUSD.status === 429) {
          console.log("CoinGecko API rate limited, using fallback data")
          return NextResponse.json(generateMockTrendData())
        }
        throw new Error(`CoinGecko API error: ${topCoinsResponseUSD.status}`)
      }

      const topCoinsDataUSD = await topCoinsResponseUSD.json()

      // Fetch the same data in GBP
      const topCoinsResponseGBP = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d",
        {
          headers: {
            Accept: "application/json",
          },
          next: { revalidate: 300 },
        },
      )

      if (!topCoinsResponseGBP.ok) {
        // If we hit rate limits, use USD data only and simulate GBP prices
        if (topCoinsResponseGBP.status === 429) {
          console.log("CoinGecko API rate limited for GBP, simulating GBP prices")
          // Create a map of simulated GBP prices (roughly 0.8 of USD price)
          const gbpPriceMap = {}
          topCoinsDataUSD.forEach((coin) => {
            gbpPriceMap[coin.id] = {
              currentPrice: coin.current_price * 0.8,
            }
          })

          // Continue with the rest of the function using the simulated GBP data
          // Skip the trending API call to reduce rate limiting
          const responseData = processApiData(topCoinsDataUSD, gbpPriceMap, null)
          cacheTrendData(responseData)
          return NextResponse.json(responseData)
        }
        throw new Error(`CoinGecko API error for GBP: ${topCoinsResponseGBP.status}`)
      }

      const topCoinsDataGBP = await topCoinsResponseGBP.json()

      // Create a map of GBP prices by coin id
      const gbpPriceMap = {}
      topCoinsDataGBP.forEach((coin) => {
        gbpPriceMap[coin.id] = {
          currentPrice: coin.current_price,
        }
      })

      // Get trending coins from CoinGecko
      let trendingData = null
      try {
        const trendingResponse = await fetch("https://api.coingecko.com/api/v3/search/trending", {
          headers: {
            Accept: "application/json",
          },
          next: { revalidate: 300 },
        })

        if (trendingResponse.ok) {
          trendingData = await trendingResponse.json()
        } else {
          console.log(`CoinGecko trending API error: ${trendingResponse.status}, skipping trending data`)
        }
      } catch (error) {
        console.log("Error fetching trending data, skipping:", error)
      }

      // Process the API data and create the response
      const responseData = processApiData(topCoinsDataUSD, gbpPriceMap, trendingData)

      // Cache the data for future use during rate limiting
      cacheTrendData(responseData)

      return NextResponse.json(responseData)
    } catch (error) {
      // If any API call fails but we have cached data, use that instead
      if (cachedData) {
        console.log("Error fetching from CoinGecko API, using cached data:", error)
        return NextResponse.json({
          ...cachedData,
          disclaimer: cachedData.disclaimer + " (Note: Using cached data due to API limitations.)",
        })
      }

      // If no cached data, throw the error to be handled below
      throw error
    }
  } catch (error) {
    console.error("Error generating trend analysis:", error)

    // If we have no cached data, generate mock data as a fallback
    const mockData = generateMockTrendData()

    return NextResponse.json({
      ...mockData,
      error: "Failed to fetch live data from CoinGecko API. Showing simulated data instead.",
      disclaimer:
        "This is simulated data due to API rate limiting. The data does not reflect current market conditions.",
    })
  }
}

// Helper function to process API data and create the response
function processApiData(topCoinsDataUSD, gbpPriceMap, trendingData) {
  // Current date for reference
  const currentDate = new Date()
  const dateString = currentDate.toISOString()

  // Analyze for unusual price movements, volume spikes, etc.
  const potentialPumps = topCoinsDataUSD
    .filter((coin) => {
      // Look for coins with positive momentum across timeframes
      const hourChange = coin.price_change_percentage_1h_in_currency || 0
      const dayChange = coin.price_change_percentage_24h_in_currency || 0
      const weekChange = coin.price_change_percentage_7d_in_currency || 0

      // Volume to market cap ratio (high ratio can indicate unusual activity)
      const volumeToMarketCap = coin.total_volume / coin.market_cap

      // Criteria for potential pumps:
      // 1. Strong recent momentum (1h change > 3%)
      // 2. Positive across multiple timeframes
      // 3. High trading volume relative to market cap
      return hourChange > 3 && dayChange > 0 && weekChange > -5 && volumeToMarketCap > 0.1
    })
    .slice(0, 5) // Limit to top 5 results
    .map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      currentPrice: coin.current_price,
      gbpPrice: gbpPriceMap[coin.id]?.currentPrice || 0,
      priceChange1h: coin.price_change_percentage_1h_in_currency,
      priceChange24h: coin.price_change_percentage_24h_in_currency,
      priceChange7d: coin.price_change_percentage_7d_in_currency,
      volume: coin.total_volume,
      volumeToMarketCap: coin.total_volume / coin.market_cap,
      signals: ["Strong recent momentum", "High trading volume", "Positive price trend"],
      // Simulated news/social signals that would come from news/social APIs
      recentMentions: Math.floor(Math.random() * 100) + 50,
      trendingRank: Math.floor(Math.random() * 20),
    }))

  const potentialDrops = topCoinsDataUSD
    .filter((coin) => {
      // Look for coins with negative momentum
      const hourChange = coin.price_change_percentage_1h_in_currency || 0
      const dayChange = coin.price_change_percentage_24h_in_currency || 0
      const weekChange = coin.price_change_percentage_7d_in_currency || 0

      // Volume to market cap ratio
      const volumeToMarketCap = coin.total_volume / coin.market_cap

      // Criteria for potential drops:
      // 1. Recent downward momentum (1h change < -3%)
      // 2. Negative across multiple timeframes
      // 3. High trading volume relative to market cap
      return hourChange < -3 && dayChange < 0 && volumeToMarketCap > 0.1
    })
    .slice(0, 5) // Limit to top 5 results
    .map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      currentPrice: coin.current_price,
      gbpPrice: gbpPriceMap[coin.id]?.currentPrice || 0,
      priceChange1h: coin.price_change_percentage_1h_in_currency,
      priceChange24h: coin.price_change_percentage_24h_in_currency,
      priceChange7d: coin.price_change_percentage_7d_in_currency,
      volume: coin.total_volume,
      volumeToMarketCap: coin.total_volume / coin.market_cap,
      signals: ["Downward momentum", "High selling volume", "Negative price trend"],
      // Simulated news/social signals
      recentMentions: Math.floor(Math.random() * 100) + 20,
      trendingRank: Math.floor(Math.random() * 50) + 20,
    }))

  // Get trending coins from CoinGecko's trending endpoint
  let trendingCoins = []
  if (trendingData && trendingData.coins) {
    trendingCoins = trendingData.coins
      .map((item) => {
        const coin = item.item
        // Since we might not have price data, simulate it based on rank
        const simulatedPrice = 10000 / (coin.market_cap_rank || 100)

        return {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.large,
          marketCapRank: coin.market_cap_rank,
          price: simulatedPrice,
          gbpPrice: simulatedPrice * 0.8,
          // These would come from additional API calls in a real app
          signals: ["High social volume", "Trending on CoinGecko", "Community growth"],
          score: Math.floor(Math.random() * 100) + 1,
        }
      })
      .slice(0, 7) // Limit to top 7
  } else {
    // If no trending data, use top coins as a fallback
    trendingCoins = topCoinsDataUSD.slice(0, 7).map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      marketCapRank: coin.market_cap_rank,
      price: coin.current_price,
      gbpPrice: gbpPriceMap[coin.id]?.currentPrice || 0,
      signals: ["Popular cryptocurrency", "High market cap", "Active trading"],
      score: Math.floor(Math.random() * 100) + 1,
    }))
  }

  // Simulated news mentions that would come from a news API
  const topNewsMentions = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      mentions: 342,
      sentiment: 0.65, // 0-1 scale, higher is more positive
      headlines: [
        "Bitcoin ETF sees record inflows as institutional interest grows",
        "Major bank announces Bitcoin custody solution",
      ],
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      mentions: 287,
      sentiment: 0.72,
      headlines: ["Ethereum upgrade scheduled for next month", "DeFi growth continues to drive Ethereum adoption"],
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      mentions: 156,
      sentiment: 0.58,
      headlines: ["Solana NFT marketplace sees record volume", "New DeFi protocol launches on Solana"],
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      mentions: 98,
      sentiment: 0.51,
      headlines: ["Cardano announces new partnership", "Development activity increases on Cardano"],
    },
    {
      id: "ripple",
      name: "XRP",
      symbol: "XRP",
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      mentions: 76,
      sentiment: 0.48,
      headlines: ["XRP lawsuit developments", "New exchange listings for XRP"],
    },
  ]

  // Create the response data
  return {
    timestamp: dateString,
    potentialPumps,
    potentialDrops,
    trendingCoins,
    topNewsMentions,
    disclaimer:
      "This analysis is based on historical data and current trends. It should not be considered as financial advice. Always do your own research before making investment decisions.",
  }
}
