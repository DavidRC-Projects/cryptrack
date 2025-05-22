// This file now uses our API routes which fetch real data from CoinGecko

// Fetch top 20 cryptocurrencies
export async function fetchCryptoData() {
  try {
    const response = await fetch("/api/crypto", { next: { revalidate: 60 } })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch crypto data:", error)
    throw error
  }
}

// Fetch trending coins
export async function fetchTrendingCoins() {
  try {
    // Updated to use the new API route
    const response = await fetch("/api/trending", { next: { revalidate: 300 } })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch trending coins:", error)
    throw error
  }
}

// Fetch detailed data for a specific cryptocurrency
export async function fetchCryptoDetails(id) {
  try {
    const response = await fetch(`/api/crypto/${id}`, { next: { revalidate: 60 } })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch details for cryptocurrency ${id}:`, error)
    throw error
  }
}

// Fetch sentiment analysis data
export async function fetchSentimentData(id) {
  try {
    const response = await fetch(`/api/crypto/${id}/sentiment`, { next: { revalidate: 300 } })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch sentiment data for cryptocurrency ${id}:`, error)
    throw error
  }
}
