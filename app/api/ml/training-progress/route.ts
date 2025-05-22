// Simple in-memory store for training progress
const trainingProgress = new Map()

export function GET(request: Request) {
  // Get coin from query parameters
  const { searchParams } = new URL(request.url)
  const coin = searchParams.get("coin") || "unknown"

  // Set up Server-Sent Events
  const responseStream = new ReadableStream({
    start(controller) {
      // Function to send progress updates
      const sendProgress = () => {
        // Get current progress for this coin
        const progress = trainingProgress.get(coin) || {
          epoch: 0,
          totalEpochs: 10,
          loss: 0,
          accuracy: 0,
        }

        // Send event
        controller.enqueue(`data: ${JSON.stringify(progress)}\n\n`)

        // If training is complete, close the stream
        if (progress.epoch >= progress.totalEpochs) {
          controller.close()
          return
        }

        // Schedule next update
        setTimeout(sendProgress, 1000)
      }

      // Start sending updates
      sendProgress()
    },
  })

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

// Export a helper function that can be used by train-predict.ts route
export function updateTrainingProgress(coin: string, progress: any) {
  trainingProgress.set(coin, progress)
}
