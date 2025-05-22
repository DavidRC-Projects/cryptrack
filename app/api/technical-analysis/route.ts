import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch top 20 cryptocurrencies with both USD and GBP data
    const cryptoResponseUSD = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1",
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 3600 }, // Revalidate hourly
      },
    )

    if (!cryptoResponseUSD.ok) {
      throw new Error(`CoinGecko API error: ${cryptoResponseUSD.status}`)
    }

    const cryptoDataUSD = await cryptoResponseUSD.json()

    // Fetch the same data in GBP
    const cryptoResponseGBP = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=20&page=1",
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      },
    )

    if (!cryptoResponseGBP.ok) {
      throw new Error(`CoinGecko API error for GBP: ${cryptoResponseGBP.status}`)
    }

    const cryptoDataGBP = await cryptoResponseGBP.json()

    // Create a map of GBP prices by coin id
    const gbpPriceMap: { [key: string]: { currentPrice: number } } = {}
    cryptoDataGBP.forEach((coin: any) => {
      gbpPriceMap[coin.id] = {
        currentPrice: coin.current_price,
      }
    })

    // For each cryptocurrency, calculate technical indicators
    const technicalAnalysisData = await Promise.all(
      cryptoDataUSD.map(async (crypto: any) => {
        // Get GBP price
        const gbpPrice = gbpPriceMap[crypto.id]?.currentPrice || 0

        // In a real app, we would fetch historical data and calculate indicators
        // Since we don't have access to that, we'll simulate realistic technical analysis data

        // Simulate RSI (Relative Strength Index)
        const rsiValue = simulateRSI(crypto.price_change_percentage_24h, crypto.price_change_percentage_7d_in_currency)
        const rsiStatus = getRSIStatus(rsiValue)

        // Simulate MACD
        const macdData = simulateMACD(crypto.price_change_percentage_24h, crypto.price_change_percentage_7d_in_currency)

        // Simulate support and resistance levels based on current price
        const supportResistance = simulateSupportResistance(crypto.current_price, gbpPrice)

        // Determine overall technical outlook
        const technicalOutlook = determineTechnicalOutlook(rsiValue, macdData, crypto.price_change_percentage_24h)

        // Generate a prediction based on technical indicators
        const prediction = generatePrediction(
          crypto.name,
          rsiValue,
          macdData,
          supportResistance,
          technicalOutlook,
          crypto.current_price,
        )

        return {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          image: crypto.image,
          currentPrice: crypto.current_price,
          gbpPrice: gbpPrice,
          priceChange24h: crypto.price_change_percentage_24h,
          marketCapRank: crypto.market_cap_rank,
          technicalIndicators: {
            rsi: {
              value: rsiValue,
              status: rsiStatus,
              description: getRSIDescription(rsiStatus),
            },
            macd: {
              value: macdData.value,
              signal: macdData.signal,
              histogram: macdData.histogram,
              trend: macdData.trend,
              crossover: macdData.crossover,
              description: getMACDDescription(macdData.trend, macdData.crossover),
            },
            supportResistance: {
              support1: supportResistance.support1,
              support2: supportResistance.support2,
              resistance1: supportResistance.resistance1,
              resistance2: supportResistance.resistance2,
              nearestLevel: supportResistance.nearestLevel,
              nearestLevelGBP: supportResistance.nearestLevelGBP,
              nearestType: supportResistance.nearestType,
              support1GBP: supportResistance.support1GBP,
              support2GBP: supportResistance.support2GBP,
              resistance1GBP: supportResistance.resistance1GBP,
              resistance2GBP: supportResistance.resistance2GBP,
            },
            technicalOutlook: {
              outlook: technicalOutlook.outlook,
              strength: technicalOutlook.strength,
              description: technicalOutlook.description,
              prediction: prediction,
            },
          },
        }
      }),
    )

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      data: technicalAnalysisData,
      disclaimer:
        "This technical analysis is simulated and for demonstration purposes only. In a production environment, this would use real historical data and proper technical analysis calculations.",
    })
  } catch (error) {
    console.error("Error generating technical analysis:", error instanceof Error ? error.message : error)
    if (error instanceof Error && error.stack) {
      console.error(error.stack)
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

// Helper function to simulate RSI based on recent price changes
function simulateRSI(priceChange24h: any, priceChange7d: any) {
  // Base RSI on recent price changes with some randomness
  // RSI ranges from 0-100, with >70 considered overbought and <30 considered oversold
  let baseRSI = 50 // Neutral starting point

  // Adjust based on price changes
  if (priceChange24h) {
    // Scale the price change to have more impact on RSI
    baseRSI += priceChange24h * 1.2
  }

  if (priceChange7d) {
    // Weekly trend has less impact than daily
    baseRSI += priceChange7d * 0.3
  }

  // Add some randomness (less than before for more realistic values)
  baseRSI += Math.random() * 10 - 5

  // Make extreme values less common
  if (baseRSI > 70) {
    baseRSI = 70 + (baseRSI - 70) * 0.5
  } else if (baseRSI < 30) {
    baseRSI = 30 - (30 - baseRSI) * 0.5
  }

  // Ensure RSI stays within 0-100 range
  return Math.min(95, Math.max(5, baseRSI))
}

// Helper function to get RSI status
function getRSIStatus(rsiValue: any) {
  if (rsiValue >= 70) return "overbought"
  if (rsiValue <= 30) return "oversold"
  return "neutral"
}

// Helper function to get RSI description
function getRSIDescription(status: any) {
  switch (status) {
    case "overbought":
      return "RSI indicates overbought conditions, suggesting potential price reversal or correction."
    case "oversold":
      return "RSI indicates oversold conditions, suggesting potential price reversal or bounce."
    case "neutral":
      return "RSI is in neutral territory, neither overbought nor oversold."
    default:
      return "RSI analysis unavailable."
  }
}

// Helper function to simulate MACD
function simulateMACD(priceChange24h: any, priceChange7d: any) {
  // MACD consists of the MACD line, signal line, and histogram
  // We'll simulate these based on price changes

  // Base values
  let macdValue = 0
  let signalValue = 0

  // Adjust based on price changes
  if (priceChange24h !== undefined && priceChange7d !== undefined) {
    // MACD line is more responsive to recent price changes
    macdValue = priceChange24h * 0.08
    // Signal line typically lags behind MACD line
    signalValue = priceChange24h * 0.03 + priceChange7d * 0.05
  } else {
    // Add some randomness if we don't have price change data
    macdValue = Math.random() * 1.6 - 0.8
    signalValue = Math.random() * 1.6 - 0.8
  }

  // Add some randomness (less than before for more realistic values)
  macdValue += Math.random() * 0.2 - 0.1
  signalValue += Math.random() * 0.1 - 0.05

  // Calculate histogram (MACD line - Signal line)
  const histogram = macdValue - signalValue

  // Determine trend
  let trend = "neutral"
  if (macdValue > 0 && histogram > 0) trend = "bullish"
  else if (macdValue < 0 && histogram < 0) trend = "bearish"

  // Determine if there's a recent crossover
  let crossover = "none"
  if (Math.abs(histogram) < 0.05) {
    crossover = histogram > 0 ? "bullish" : "bearish"
  }

  return {
    value: Number.parseFloat(macdValue.toFixed(2)),
    signal: Number.parseFloat(signalValue.toFixed(2)),
    histogram: Number.parseFloat(histogram.toFixed(2)),
    trend,
    crossover,
  }
}

// Helper function to get MACD description
function getMACDDescription(trend: any, crossover: any) {
  if (crossover === "bullish") {
    return "MACD recently crossed above the signal line, suggesting bullish momentum."
  } else if (crossover === "bearish") {
    return "MACD recently crossed below the signal line, suggesting bearish momentum."
  } else if (trend === "bullish") {
    return "MACD is above the signal line, indicating bullish momentum."
  } else if (trend === "bearish") {
    return "MACD is below the signal line, indicating bearish momentum."
  } else {
    return "MACD is showing neutral momentum."
  }
}

// Helper function to simulate support and resistance levels
function simulateSupportResistance(currentPrice: any, gbpPrice: any) {
  if (!currentPrice) currentPrice = 100 // Default if no price available
  if (!gbpPrice) gbpPrice = currentPrice * 0.78 // Approximate GBP conversion if not available

  // Calculate support and resistance levels based on current price
  // In a real app, these would be calculated using historical price data
  const volatilityFactor = 0.03 + Math.random() * 0.07 // 3-10% volatility

  const support1 = currentPrice * (1 - volatilityFactor * (0.5 + Math.random() * 0.5))
  const support2 = support1 * (1 - volatilityFactor * (0.5 + Math.random() * 0.5))
  const resistance1 = currentPrice * (1 + volatilityFactor * (0.5 + Math.random() * 0.5))
  const resistance2 = resistance1 * (1 + volatilityFactor * (0.5 + Math.random() * 0.5))

  // Calculate GBP equivalents
  const support1GBP = support1 * (gbpPrice / currentPrice)
  const support2GBP = support2 * (gbpPrice / currentPrice)
  const resistance1GBP = resistance1 * (gbpPrice / currentPrice)
  const resistance2GBP = resistance2 * (gbpPrice / currentPrice)

  // Determine nearest level
  const levels = [
    { type: "support", level: 1, value: support1, valueGBP: support1GBP, distance: Math.abs(currentPrice - support1) },
    { type: "support", level: 2, value: support2, valueGBP: support2GBP, distance: Math.abs(currentPrice - support2) },
    {
      type: "resistance",
      level: 1,
      value: resistance1,
      valueGBP: resistance1GBP,
      distance: Math.abs(currentPrice - resistance1),
    },
    {
      type: "resistance",
      level: 2,
      value: resistance2,
      valueGBP: resistance2GBP,
      distance: Math.abs(currentPrice - resistance2),
    },
  ]

  // Sort by distance
  levels.sort((a, b) => a.distance - b.distance)
  const nearest = levels[0]

  return {
    support1: Number.parseFloat(support1.toFixed(currentPrice < 1 ? 6 : 2)),
    support2: Number.parseFloat(support2.toFixed(currentPrice < 1 ? 6 : 2)),
    resistance1: Number.parseFloat(resistance1.toFixed(currentPrice < 1 ? 6 : 2)),
    resistance2: Number.parseFloat(resistance2.toFixed(currentPrice < 1 ? 6 : 2)),
    nearestLevel: Number.parseFloat(nearest.value.toFixed(currentPrice < 1 ? 6 : 2)),
    nearestLevelGBP: Number.parseFloat(nearest.valueGBP.toFixed(currentPrice < 1 ? 6 : 2)),
    nearestType: `${nearest.type}${nearest.level}`,
    support1GBP: Number.parseFloat(support1GBP.toFixed(currentPrice < 1 ? 6 : 2)),
    support2GBP: Number.parseFloat(support2GBP.toFixed(currentPrice < 1 ? 6 : 2)),
    resistance1GBP: Number.parseFloat(resistance1GBP.toFixed(currentPrice < 1 ? 6 : 2)),
    resistance2GBP: Number.parseFloat(resistance2GBP.toFixed(currentPrice < 1 ? 6 : 2)),
  }
}

// Helper function to determine overall technical outlook
function determineTechnicalOutlook(rsiValue: any, macdData: any, priceChange24h: any) {
  // Count bullish and bearish signals
  let bullishSignals = 0
  let bearishSignals = 0

  // RSI signals
  if (rsiValue <= 30)
    bullishSignals += 1 // Oversold is bullish
  else if (rsiValue >= 70) bearishSignals += 1 // Overbought is bearish

  // MACD signals
  if (macdData.trend === "bullish") bullishSignals += 1
  else if (macdData.trend === "bearish") bearishSignals += 1

  if (macdData.crossover === "bullish") bullishSignals += 1
  else if (macdData.crossover === "bearish") bearishSignals += 1

  // Recent price action
  if (priceChange24h > 0) bullishSignals += 0.5
  else if (priceChange24h < 0) bearishSignals += 0.5

  // Determine outlook
  let outlook = "neutral"
  let strength = "weak"
  let description = "Technical indicators are showing mixed signals."

  if (bullishSignals > bearishSignals + 1) {
    outlook = "bullish"
    if (bullishSignals > bearishSignals + 2) {
      strength = "strong"
      description = "Multiple technical indicators are showing strong bullish signals."
    } else {
      description = "Technical indicators are leaning bullish, but with moderate strength."
    }
  } else if (bearishSignals > bullishSignals + 1) {
    outlook = "bearish"
    if (bearishSignals > bullishSignals + 2) {
      strength = "strong"
      description = "Multiple technical indicators are showing strong bearish signals."
    } else {
      description = "Technical indicators are leaning bearish, but with moderate strength."
    }
  }

  return { outlook, strength, description }
}

// Helper function to generate a prediction based on technical indicators
function generatePrediction(name: any, rsiValue: any, macdData: any, supportResistance: any, technicalOutlook: any, currentPrice: any) {
  const symbol = name.split(" ")[0] // Use first word of name as symbol for the prediction

  // Base prediction on technical outlook
  if (technicalOutlook.outlook === "bullish") {
    if (technicalOutlook.strength === "strong") {
      const targetPrice = supportResistance.resistance1
      const percentGain = ((targetPrice - currentPrice) / currentPrice) * 100
      return `${symbol} is showing strong bullish momentum with positive RSI and MACD readings. Price could test resistance at $${formatPrice(
        targetPrice,
      )} (${percentGain.toFixed(1)}% gain) in the short term.`
    } else {
      return `${symbol} is showing moderate bullish signals but may face resistance near $${formatPrice(
        supportResistance.resistance1,
      )}. Watch for continued momentum in MACD to confirm uptrend.`
    }
  } else if (technicalOutlook.outlook === "bearish") {
    if (technicalOutlook.strength === "strong") {
      const targetPrice = supportResistance.support1
      const percentLoss = ((currentPrice - targetPrice) / currentPrice) * 100
      return `${symbol} is showing strong bearish momentum with negative technical indicators. Price could test support at $${formatPrice(
        targetPrice,
      )} (${percentLoss.toFixed(1)}% drop) if selling pressure continues.`
    } else {
      return `${symbol} is showing moderate bearish signals and may find support near $${formatPrice(
        supportResistance.support1,
      )}. Monitor RSI for potential oversold conditions that could trigger a bounce.`
    }
  } else {
    // Neutral outlook
    if (rsiValue > 50 && macdData.histogram > 0) {
      return `${symbol} is consolidating with slightly positive bias. Price is likely to trade between $${formatPrice(
        supportResistance.support1,
      )} and $${formatPrice(supportResistance.resistance1)} in the near term.`
    } else if (rsiValue < 50 && macdData.histogram < 0) {
      return `${symbol} is consolidating with slightly negative bias. Watch for a break below $${formatPrice(
        supportResistance.support1,
      )} which could accelerate selling.`
    } else {
      return `${symbol} is showing mixed signals and may continue to trade sideways. Key levels to watch are $${formatPrice(
        supportResistance.support1,
      )} and $${formatPrice(supportResistance.resistance1)}.`
    }
  }
}

// Helper function to format price based on its magnitude
function formatPrice(price: any) {
  if (price >= 1000) {
    return price.toLocaleString()
  } else if (price >= 1) {
    return price.toFixed(2)
  } else {
    // For very small prices (e.g., SHIB, DOGE)
    return price.toFixed(6)
  }
}
