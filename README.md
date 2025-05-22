# Crypto Tracker

A modern, responsive cryptocurrency tracking application built with Next.js, TypeScript, and Tailwind CSS. This application provides real-time cryptocurrency data, detailed analytics, and sentiment analysis in a beautiful, user-friendly interface.

## Features

- 📊 Real-time cryptocurrency price tracking
- 💹 Detailed market statistics and price changes
- 📈 Sentiment analysis from social media and news
- 🎯 User-friendly navigation with section jumping
- 🎨 Modern, responsive design with dark mode
- ⚡ Fast and efficient data loading
- 🔄 Smart error handling with automatic retries
- ♿ Accessibility features

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide Icons
- **State Management:** React Hooks
- **API Integration:** Custom API client

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crypto-tracker.git
   cd crypto-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```env
   NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
crypto-tracker/
├── app/                    # Next.js app directory
│   ├── crypto/            # Cryptocurrency detail pages
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
├── lib/                   # Utility functions and API clients
├── public/               # Static assets
└── styles/               # Global styles
```

## Features in Detail

### Cryptocurrency Tracking
- Real-time price updates
- Market cap and volume information
- Price change percentages (24h, 7d, 30d)
- Circulating supply and total supply data

### Sentiment Analysis
- Social media sentiment tracking
- News sentiment analysis
- Trending topics
- Market sentiment indicators

### User Experience
- Smooth navigation with section jumping
- Responsive design for all devices
- Loading states and error handling
- Back to top button
- Accessible UI components

### Error Handling
- Smart retry mechanism with exponential backoff
- User-friendly error messages
- Visual error feedback
- Automatic recovery for network issues

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework 