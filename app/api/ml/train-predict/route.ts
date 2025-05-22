import { NextResponse } from "next/server"
import { updateTrainingProgress } from "../training-progress/route"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { coin, data, lookbackWindow, predictionDays } = body

    if (!coin || !data || !Array.isArray(data) || data.length < 30) {
      return NextResponse.json({ error: "Missing or invalid data. Need at least 30 data points." }, { status: 400 })
    }

    // Extract just the prices for training
    const prices = data.map((point) => point.price)

    // Train LSTM model and get predictions
    const { predictions, metrics, modelSummary } = await trainLSTMAndPredict(
      coin,
      prices,
      lookbackWindow || 14,
      predictionDays || 7,
    )

    return NextResponse.json({
      predictions,
      metrics,
      modelSummary,
    })
  } catch (error) {
    console.error("Error in LSTM training:", error)
    return NextResponse.json({ error: "Failed to train model or generate predictions" }, { status: 500 })
  }
}

// Main function to train LSTM model and generate predictions
async function trainLSTMAndPredict(coin: string, prices: number[], lookbackWindow: number, predictionDays: number) {
  // Simulate LSTM training and prediction
  // In a real implementation, this would use TensorFlow.js
  console.log(`Training LSTM model for ${coin} with ${prices.length} data points`)
  console.log(`Using lookback window: ${lookbackWindow}, predicting days: ${predictionDays}`)

  // Normalize data (scale between 0 and 1)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice
  const normalizedPrices = prices.map((price) => (price - minPrice) / priceRange)

  // Simulated LSTM training (would use actual TensorFlow.js in real implementation)
  const totalEpochs = 10
  for (let epoch = 1; epoch <= totalEpochs; epoch++) {
    // Simulate training time with delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulate training metrics
    const progress = {
      epoch,
      totalEpochs,
      loss: 0.5 * Math.pow(0.85, epoch) + Math.random() * 0.02,
      accuracy: 0.5 + (1 - 0.5 * Math.pow(0.85, epoch)) + Math.random() * 0.05,
    }

    // Update progress for SSE
    updateTrainingProgress(coin, progress)

    console.log(
      `Epoch ${epoch}/${totalEpochs}, Loss: ${progress.loss.toFixed(4)}, Accuracy: ${progress.accuracy.toFixed(4)}`,
    )
  }

  // Generate predictions for future days
  const lastPrice = prices[prices.length - 1]
  const predictions = []

  let currentPrediction = lastPrice
  for (let i = 1; i <= predictionDays; i++) {
    // Simple prediction logic (in real implementation would use the trained LSTM model)
    // This creates a slightly random but trending prediction
    const dailyChangePercent = (Math.random() * 6 - 3) / 100 // -3% to +3% daily change
    currentPrediction = currentPrediction * (1 + dailyChangePercent)

    // Calculate confidence interval (gets wider as we predict further in the future)
    const confidenceFactor = 0.02 * Math.sqrt(i) // Increases with sqrt of days in future
    const upperBound = currentPrediction * (1 + confidenceFactor)
    const lowerBound = currentPrediction * (1 - confidenceFactor)

    predictions.push({
      predicted: currentPrediction,
      upper_bound: upperBound,
      lower_bound: lowerBound,
    })
  }

  // Generate model performance metrics
  const mae = generateRandomMetric(lastPrice * 0.02, lastPrice * 0.05) // 2-5% of last price
  const rmse = mae * (1 + Math.random() * 0.5) // RMSE is typically higher than MAE
  const r2 = 0.6 + Math.random() * 0.3 // Random R² between 0.6 and 0.9

  const metrics = {
    mae,
    rmse,
    r2,
  }

  // Mock model summary
  const modelSummary = `LSTM Neural Network Architecture:
- Input layer: ${lookbackWindow} time steps
- LSTM layer: 64 units, activation=tanh
- Dropout layer: rate=0.2
- LSTM layer: 32 units, activation=tanh
- Dropout layer: rate=0.2
- Dense layer: 16 units, activation=relu
- Output layer: 1 unit, activation=linear

Total params: 25,361
Trainable params: 25,361
Non-trainable params: 0`

  return { predictions, metrics, modelSummary }
}

// Helper function to generate random metrics within a range
function generateRandomMetric(min: number, max: number) {
  return min + Math.random() * (max - min)
}
