// Fetch market insights including Fear & Greed Index and M2 Money Supply
export async function fetchMarketInsights() {
  try {
    const response = await fetch("/api/market-insights", { next: { revalidate: 3600 } }) // Revalidate hourly

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch market insights:", error)
    throw error
  }
}
