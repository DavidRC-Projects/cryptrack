import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Fetch Fear & Greed Index
    const fearGreedResponse = await fetch("https://api.alternative.me/fng/", {
      next: { revalidate: 3600 }, // Revalidate hourly
    })

    if (!fearGreedResponse.ok) {
      throw new Error(`Fear & Greed API error: ${fearGreedResponse.status}`)
    }

    const fearGreedData = await fearGreedResponse.json()

    // For M2 Money Supply, we would typically fetch from FRED API
    // Since FRED requires an API key, we'll simulate this data with realistic values
    // In a production app, you would use the actual FRED API with your API key

    // Current date for calculations
    const today = new Date()

    // Simulated M2 data (last 6 months) - Using more realistic values as of May 2024
    // M2 is currently around 20.9-21.2 trillion USD
    const m2Data = [
      {
        date: new Date(today.getFullYear(), today.getMonth() - 5, 1).toISOString().split("T")[0],
        value: 20.82, // 6 months ago
      },
      {
        date: new Date(today.getFullYear(), today.getMonth() - 4, 1).toISOString().split("T")[0],
        value: 20.79, // 5 months ago
      },
      {
        date: new Date(today.getFullYear(), today.getMonth() - 3, 1).toISOString().split("T")[0],
        value: 20.85, // 4 months ago
      },
      {
        date: new Date(today.getFullYear(), today.getMonth() - 2, 1).toISOString().split("T")[0],
        value: 20.91, // 3 months ago
      },
      {
        date: new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split("T")[0],
        value: 21.03, // 2 months ago
      },
      {
        date: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0],
        value: 21.18, // Current month
      },
    ]

    // Calculate month-over-month change
    const currentM2 = m2Data[m2Data.length - 1].value
    const previousMonthM2 = m2Data[m2Data.length - 2].value
    const sixMonthsAgoM2 = m2Data[0].value

    const monthlyChangePercent = ((currentM2 - previousMonthM2) / previousMonthM2) * 100
    const sixMonthChangePercent = ((currentM2 - sixMonthsAgoM2) / sixMonthsAgoM2) * 100

    // Determine liquidity trend based on month-over-month change
    let liquidityTrend = ""
    if (monthlyChangePercent > 1) {
      liquidityTrend = "increasing_rapidly"
    } else if (monthlyChangePercent > 0.2) {
      liquidityTrend = "increasing"
    } else if (monthlyChangePercent < -1) {
      liquidityTrend = "decreasing_rapidly"
    } else if (monthlyChangePercent < -0.2) {
      liquidityTrend = "decreasing"
    } else {
      liquidityTrend = "stable"
    }

    // Get the current Fear & Greed value and classification
    const currentFearGreed = fearGreedData.data[0]
    const fearGreedValue = Number.parseInt(currentFearGreed.value)

    // Determine market advice based on indicators
    let marketAdvice = ""

    // Generate market advice based on Fear & Greed and M2 liquidity
    if (fearGreedValue <= 25) {
      // Extreme Fear
      if (liquidityTrend === "increasing" || liquidityTrend === "increasing_rapidly") {
        marketAdvice =
          "Market is in extreme fear while liquidity is increasing. This could present buying opportunities as fear may be overblown with strong liquidity support."
      } else {
        marketAdvice =
          "Market is in extreme fear with tightening liquidity. Caution is advised, but extreme fear can present selective buying opportunities for long-term investors."
      }
    } else if (fearGreedValue <= 45) {
      // Fear
      if (liquidityTrend === "increasing" || liquidityTrend === "increasing_rapidly") {
        marketAdvice =
          "Market sentiment is fearful despite improving liquidity conditions. This divergence may present opportunities in quality assets."
      } else {
        marketAdvice =
          "Market sentiment is fearful with tightening liquidity. Selective approach recommended with focus on assets with strong fundamentals."
      }
    } else if (fearGreedValue <= 55) {
      // Neutral
      if (liquidityTrend === "increasing" || liquidityTrend === "increasing_rapidly") {
        marketAdvice =
          "Market sentiment is neutral with improving liquidity. Conditions appear balanced with potential for upside if sentiment improves."
      } else {
        marketAdvice =
          "Market sentiment is neutral but liquidity is tightening. Consider balanced exposure with some defensive positioning."
      }
    } else if (fearGreedValue <= 75) {
      // Greed
      if (liquidityTrend === "increasing" || liquidityTrend === "increasing_rapidly") {
        marketAdvice =
          "Market is showing greed with strong liquidity support. While momentum may continue, consider taking some profits and being selective with new positions."
      } else {
        marketAdvice =
          "Market is showing greed despite tightening liquidity. This divergence suggests caution and selective profit-taking may be prudent."
      }
    } else {
      // Extreme Greed
      if (liquidityTrend === "increasing" || liquidityTrend === "increasing_rapidly") {
        marketAdvice =
          "Market is in extreme greed with abundant liquidity. While this could fuel further gains, consider taking profits as valuations may be stretched."
      } else {
        marketAdvice =
          "Market is in extreme greed despite tightening liquidity. This divergence is a warning sign - consider defensive positioning and taking profits."
      }
    }

    // Historical Fear & Greed data (last 7 days)
    const fearGreedHistory = fearGreedData.data.slice(0, 7).map((item) => ({
      value: Number.parseInt(item.value),
      classification: item.value_classification,
      date: item.timestamp,
    }))

    return NextResponse.json({
      fearAndGreed: {
        current: {
          value: fearGreedValue,
          classification: currentFearGreed.value_classification,
          timestamp: currentFearGreed.timestamp,
        },
        history: fearGreedHistory,
      },
      m2MoneySupply: {
        current: m2Data[m2Data.length - 1],
        history: m2Data,
        trend: liquidityTrend,
        monthlyChange: {
          value: currentM2 - previousMonthM2,
          percent: monthlyChangePercent.toFixed(2),
        },
        sixMonthChange: {
          value: currentM2 - sixMonthsAgoM2,
          percent: sixMonthChangePercent.toFixed(2),
        },
        trendDefinitions: {
          increasing_rapidly: "Growth exceeding 1% month-over-month",
          increasing: "Growth between 0.2% and 1% month-over-month",
          stable: "Change between -0.2% and 0.2% month-over-month",
          decreasing: "Decline between -0.2% and -1% month-over-month",
          decreasing_rapidly: "Decline exceeding 1% month-over-month",
        },
      },
      marketAdvice: marketAdvice,
    })
  } catch (error) {
    console.error("Error fetching market insights:", error)
    return NextResponse.json({ error: "Failed to fetch market insights" }, { status: 500 })
  }
}
