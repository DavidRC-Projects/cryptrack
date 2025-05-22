// Fetch trend analysis data with improved error handling
export async function fetchTrendAnalysis() {
  try {
    // Add a random cache buster to prevent browser caching
    const cacheBuster = Math.random().toString(36).substring(7)
    const response = await fetch(`/api/trend-analysis?_=${cacheBuster}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      // Add a longer timeout to prevent quick failures
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.warn(`Trend analysis API returned status: ${response.status}`)
      // Still try to parse the response as it might contain fallback data
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch trend analysis:", error)
    // Return a minimal fallback object that the component can handle
    return {
      error: "Failed to fetch trend analysis data. Please try again later.",
      timestamp: new Date().toISOString(),
      potentialPumps: [],
      potentialDrops: [],
      trendingCoins: [],
      topNewsMentions: [],
      disclaimer: "Unable to load data. This could be due to API rate limiting or network issues.",
    }
  }
}

// Fetch ML predictions data (to be implemented)
export async function fetchMlPredictions(crypto: string, days = 7) {
  try {
    const response = await fetch(`/api/ml/predictions?crypto=${crypto}&days=${days}`, {
      next: { revalidate: 3600 }, // Revalidate hourly
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch ML predictions:", error)
    throw error
  }
}
