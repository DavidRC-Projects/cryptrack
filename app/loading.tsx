export default function Loading() {
  return (
    <div className="min-h-screen crypto-gradient text-white flex flex-col justify-center items-center p-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-lg font-medium text-gray-300">Loading...</p>
      <p className="text-sm text-gray-400 mt-2">Please wait while we fetch the latest data</p>
    </div>
  )
}
