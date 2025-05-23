import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// Fetch sentiment data for a specific cryptocurrency
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real app, this would fetch actual sentiment data from various sources
    // For this demo, we'll generate mock sentiment data

    // Generate a base sentiment score (0-100)
    const baseScore = Math.floor(Math.random() * 100)

    // Create sentiment data
    const sentimentData = {
      overallScore: baseScore,
      socialMediaSentiment: {
        twitter: Math.min(100, Math.max(0, baseScore * (0.8 + Math.random() * 0.4))), // Vary by ±20%
        reddit: Math.min(100, Math.max(0, baseScore * (0.8 + Math.random() * 0.4))),
        telegram: Math.min(100, Math.max(0, baseScore * (0.8 + Math.random() * 0.4))),
      },
      newsSentiment: {
        positive: baseScore > 50 ? baseScore / 100 : 0.3,
        neutral: 0.2,
        negative: baseScore < 50 ? (100 - baseScore) / 100 : 0.1,
      },
      keywordAnalysis: [
        { keyword: "bullish", count: Math.floor(baseScore / 10) },
        { keyword: "bearish", count: Math.floor((100 - baseScore) / 10) },
        { keyword: "growth", count: Math.floor(baseScore / 15) },
        { keyword: "dump", count: Math.floor((100 - baseScore) / 15) },
        { keyword: "potential", count: Math.floor(baseScore / 20) },
      ],
      sentimentTrend: Array.from({ length: 7 }, (_, i) => {
        // Generate a date for each of the last 7 days
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))

        // Generate a score that trends toward the current score
        const trendFactor = i / 6 // 0 to 1
        const randomVariation = Math.random() * 20 - 10 // -10 to +10
        const historicalBase = Math.random() * 100
        const trendedScore =
          historicalBase * (1 - trendFactor) + baseScore * trendFactor + randomVariation * (1 - trendFactor)

        return {
          date: date.toISOString().split("T")[0],
          score: Math.min(100, Math.max(0, trendedScore)),
        }
      }),
    }

    return NextResponse.json(sentimentData)
  } catch (error) {
    console.error(`Error generating sentiment data for cryptocurrency ${params.id}:`, error)
    return NextResponse.json(
      { error: `Failed to fetch sentiment data for cryptocurrency ${params.id}` },
      { status: 500 },
    )
  }
}
