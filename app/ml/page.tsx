"use client"

import { LstmPrediction } from "@/components/lstm-prediction"

export default function MLPage() {
  return (
    <main className="min-h-screen crypto-gradient text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Crypto Price Prediction
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Forecast cryptocurrency prices using Long Short-Term Memory (LSTM) neural networks.
          </p>
        </header>

        <section className="mb-10">
          <LstmPrediction />
        </section>

        <section className="bg-slate-850/70 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">About LSTM Price Prediction</h2>

          <div className="prose prose-invert max-w-none text-gray-300">
            <h3 className="text-xl font-semibold mb-2 text-gray-200">What is LSTM?</h3>
            <p>
              Long Short-Term Memory (LSTM) is a specialized type of recurrent neural network (RNN) designed to
              recognize and predict patterns in sequential data. Unlike traditional neural networks, LSTMs have "memory
              cells" that can remember important information and forget irrelevant details over long sequences.
            </p>

            <h3 className="text-xl font-semibold my-4 text-gray-200">How does it work?</h3>
            <p>Our implementation works in several steps:</p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>
                <strong>Data collection:</strong> Historical price data is gathered for your chosen cryptocurrency.
              </li>
              <li>
                <strong>Preprocessing:</strong> Data is normalized and formatted into time series sequences.
              </li>
              <li>
                <strong>Training:</strong> The LSTM model learns patterns in price movements over time.
              </li>
              <li>
                <strong>Testing:</strong> Model performance is measured on unseen data.
              </li>
              <li>
                <strong>Prediction:</strong> The trained model forecasts potential future prices.
              </li>
            </ol>

            <h3 className="text-xl font-semibold my-4 text-gray-200">Limitations</h3>
            <p>
              While machine learning models can identify patterns in historical data, they have important limitations:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>They cannot predict unexpected news events or regulatory changes.</li>
              <li>Cryptocurrency markets are highly volatile and influenced by many external factors.</li>
              <li>Past performance is not indicative of future results.</li>
              <li>The model can only identify patterns in the data it has seen.</li>
            </ul>

            <h3 className="text-xl font-semibold my-4 text-gray-200">Best Practices</h3>
            <p>For best results when working with prediction models:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use predictions as just one of many tools in your analysis.</li>
              <li>Combine technical analysis with fundamental research.</li>
              <li>Consider market sentiment and news events.</li>
              <li>Never make investment decisions based solely on model predictions.</li>
              <li>Remember that longer prediction horizons generally have higher uncertainty.</li>
            </ul>
          </div>
        </section>

        <div className="text-sm text-gray-400 text-center mt-10">
          <p>This tool is for educational purposes only and is not financial advice.</p>
          <p>Always do your own research before making investment decisions.</p>
        </div>
      </div>
    </main>
  )
}
