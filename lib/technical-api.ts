// Fetch technical analysis data for cryptocurrencies
export async function fetchTechnicalAnalysis() {
  try {
    const response = await fetch("/api/technical-analysis", { next: { revalidate: 3600 } }) // Revalidate hourly

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch technical analysis:", error)
    throw error
  }
}
