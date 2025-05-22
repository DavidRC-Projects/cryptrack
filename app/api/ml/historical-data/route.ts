import { NextResponse } from "next/server"

// In-memory cache for historical data to avoid repeated API calls
const dataCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function GET(request: Request) {
  // Get coin and days from query parameters
  const { searchParams } = new URL(request.url)
  const coin = searchParams.get("coin")
  const days = searchParams.get("days") || "60"

  if (!coin) {
    return NextResponse.json({ error: "Missing coin parameter" }, { status: 400 })
  }

  try {
    // Check if we have cached data that's still valid
    const cacheKey = `${coin}-${days}`
    const cachedItem = dataCache.get(cacheKey)

    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_EXPIRY) {
      return NextResponse.json(cachedItem.data)
    }

    // Fetch data from CoinGecko API
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes server-side
      },
    )

    if (!response.ok) {
      // If API fails due to rate limiting, try to use older cached data as fallback
      if (response.status === 429 && cachedItem) {
        console.log("CoinGecko API rate limited, using cached data")
        return NextResponse.json(cachedItem.data)
      }

      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const responseData = await response.json()

    if (!responseData.prices || !Array.isArray(responseData.prices)) {
      throw new Error("Invalid data format received from API")
    }

    // Process the raw price data
    const processedData = processHistoricalData(responseData.prices)

    // Cache the processed data
    dataCache.set(cacheKey, {
      data: processedData,
      timestamp: Date.now(),
    })

    return NextResponse.json(processedData)
  } catch (error) {
    console.error(`Error fetching data for ${coin}:`, error)

    // Try to use cached data even if expired as fallback
    const cacheKey = `${coin}-${days}`
    const cachedItem = dataCache.get(cacheKey)

    if (cachedItem) {
      console.log("API error, using cached data as fallback")
      return NextResponse.json(cachedItem.data)
    }

    // If no cached data is available, generate mock data
    console.log("No cached data available, generating mock data")
    const mockData = generateMockData(coin, Number.parseInt(days))

    return NextResponse.json(mockData)
  }
}

// Process the raw price data from CoinGecko API
function processHistoricalData(pricesArray) {
  // Sort by timestamp (ascending)
  const sortedPrices = [...pricesArray].sort((a, b) => a[0] - b[0])

  // Convert to our desired format and calculate moving average
  const window = 14 // 14-day moving average
  const processed = []

  sortedPrices.forEach((item, index) => {
    const timestamp = item[0]
    const price = item[1]
    const date = new Date(timestamp).toISOString().split("T")[0]

    // Calculate moving average if we have enough data points
    let moving_avg = null
    if (index >= window - 1) {
      const sumWindow = sortedPrices.slice(index - window + 1, index + 1).reduce((sum, item) => sum + item[1], 0)
      moving_avg = sumWindow / window
    }

    processed.push({
      timestamp,
      date,
      price,
      moving_avg,
    })
  })

  return processed
}

// Generate mock data if the API fails and we have no cache
function generateMockData(coin, days) {
  const mockData = []
  const today = new Date()

  // Base price depends on the coin to make it somewhat realistic
  let basePrice = 100
  switch (coin) {
    case "bitcoin":
      basePrice = 50000
      break
    case "ethereum":
      basePrice = 3000
      break
    case "binancecoin":
      basePrice = 500
      break
    case "solana":
      basePrice = 100
      break
    case "ripple":
      basePrice = 0.5
      break
    default:
      basePrice = 100 * Math.random() + 1 // Random price between 1 and 101
  }

  // Generate data points
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Randomize price with some trend
    const trendFactor = 0.01 // 1% maximum daily change
    const randomChange = (Math.random() * 2 - 1) * basePrice * trendFactor

    if (i < days) {
      // Make price somewhat dependent on previous day
      basePrice = mockData[mockData.length - 1].price + randomChange
    }

    const dataPoint = {
      timestamp: date.getTime(),
      date: date.toISOString().split("T")[0],
      price: basePrice,
      moving_avg: null,
    }

    mockData.push(dataPoint)
  }

  // Calculate moving averages
  const window = 14
  for (let i = window - 1; i < mockData.length; i++) {
    const slice = mockData.slice(i - window + 1, i + 1)
    const sum = slice.reduce((acc, item) => acc + item.price, 0)
    mockData[i].moving_avg = sum / window
  }

  return mockData
}
