// Fetch YouTube statistics for cryptocurrencies
export async function fetchYoutubeStats() {
  try {
    const response = await fetch("/api/youtube-stats", { next: { revalidate: 3600 } }) // Revalidate hourly

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch YouTube statistics:", error)
    throw error
  }
}
