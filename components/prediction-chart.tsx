"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { addDays, format } from "date-fns"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, Line, ResponsiveContainer, ComposedChart, XAxis, YAxis, Legend } from "recharts"

export function PredictionChart({ historicalData, predictions, isLoading, predictionDays }) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (!historicalData || !historicalData.length) {
      setChartData([])
      return
    }

    // Convert data for the chart
    const chartDataPoints = historicalData.map((dataPoint) => ({
      date: new Date(dataPoint.date),
      price: dataPoint.price,
      moving_avg: dataPoint.moving_avg,
      predicted: null,
      upper_bound: null,
      lower_bound: null,
    }))

    // Add predictions if available
    if (predictions && predictions.length) {
      const lastHistoricalDate = new Date(historicalData[historicalData.length - 1].date)

      predictions.forEach((prediction, index) => {
        const predictedDate = addDays(lastHistoricalDate, index + 1)

        chartDataPoints.push({
          date: predictedDate,
          price: null,
          moving_avg: null,
          predicted: prediction.predicted,
          upper_bound: prediction.upper_bound,
          lower_bound: prediction.lower_bound,
        })
      })
    }

    setChartData(chartDataPoints)
  }, [historicalData, predictions])

  // Define the date formatter for the X-axis
  const dateFormatter = (date) => {
    return format(new Date(date), "dd MMM")
  }

  // Calculate price range for Y-axis
  const allPrices = chartData.flatMap((d) => [d.price, d.predicted, d.upper_bound, d.lower_bound]).filter(Boolean)

  const minPrice = allPrices.length ? Math.min(...allPrices) * 0.95 : 0
  const maxPrice = allPrices.length ? Math.max(...allPrices) * 1.05 : 0

  // If data is still loading or no data available
  if (!chartData.length) {
    return (
      <Card className="p-6 bg-slate-800/30 border-slate-700/50">
        <div className="h-[400px] flex items-center justify-center text-gray-400">No data to display</div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-slate-800/30 border-slate-700/50">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-200">Price Forecast</h3>
        <p className="text-sm text-gray-400">
          {predictions ? `Historical data and ${predictionDays}-day forecast` : "Historical price data"}
        </p>
      </div>

      <div className="h-[300px] sm:h-[400px]">
        <ChartContainer className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                tickFormatter={dateFormatter}
                stroke="#888"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
                minTickGap={10}
              />

              <YAxis
                domain={[minPrice, maxPrice]}
                stroke="#888"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />

              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload

                    return (
                      <ChartTooltipContent className="bg-slate-900 border-slate-800/50">
                        <div className="text-sm font-medium">{format(data.date, "MMM dd, yyyy")}</div>

                        {data.price !== null && (
                          <div className="flex items-center">
                            <span className="w-2 h-2 mr-1 rounded-full bg-green-500" />
                            <span className="mr-2">Actual:</span>
                            <span className="text-green-500">${data.price.toFixed(2)}</span>
                          </div>
                        )}

                        {data.moving_avg !== null && (
                          <div className="flex items-center">
                            <span className="w-2 h-2 mr-1 rounded-full bg-yellow-500" />
                            <span className="mr-2">14-day MA:</span>
                            <span className="text-yellow-500">${data.moving_avg.toFixed(2)}</span>
                          </div>
                        )}

                        {data.predicted !== null && (
                          <div className="flex items-center">
                            <span className="w-2 h-2 mr-1 rounded-full bg-blue-500" />
                            <span className="mr-2">Predicted:</span>
                            <span className="text-blue-500">${data.predicted.toFixed(2)}</span>
                          </div>
                        )}

                        {data.upper_bound !== null && data.lower_bound !== null && (
                          <div className="flex items-center">
                            <span className="w-2 h-2 mr-1 rounded-full bg-blue-300" />
                            <span className="mr-2">Range:</span>
                            <span className="text-blue-300">
                              ${data.lower_bound.toFixed(2)} - ${data.upper_bound.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </ChartTooltipContent>
                    )
                  }

                  return null
                }}
              />

              <Legend
                content={
                  <ChartLegend>
                    <ChartLegendContent className="flex flex-wrap gap-3 justify-center">
                      <div className="flex items-center">
                        <span className="w-3 h-3 mr-1 rounded-full bg-green-500" />
                        <span className="text-xs sm:text-sm text-gray-400">Actual Price</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 mr-1 rounded-full bg-yellow-500" />
                        <span className="text-xs sm:text-sm text-gray-400">14-day MA</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 mr-1 rounded-full bg-blue-500" />
                        <span className="text-xs sm:text-sm text-gray-400">Predicted Price</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 mr-1 rounded-full bg-blue-300/30" />
                        <span className="text-xs sm:text-sm text-gray-400">Confidence Range</span>
                      </div>
                    </ChartLegendContent>
                  </ChartLegend>
                }
              />

              {/* Historical Prices */}
              <Area
                type="monotone"
                dataKey="price"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorPrice)"
                dot={{ r: 2, strokeWidth: 1 }}
                connectNulls
              />

              {/* Moving Average */}
              <Line
                type="monotone"
                dataKey="moving_avg"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
              />

              {/* Predicted Prices */}
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#60A5FA"
                strokeWidth={2}
                fill="url(#colorPredicted)"
                dot={{ r: 3, strokeWidth: 1 }}
                connectNulls
              />

              {/* Confidence Interval - Upper Bound */}
              <Line
                type="monotone"
                dataKey="upper_bound"
                stroke="#93C5FD"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                connectNulls
              />

              {/* Confidence Interval - Lower Bound */}
              <Line
                type="monotone"
                dataKey="lower_bound"
                stroke="#93C5FD"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}
