"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    // In a real app, this would trigger a search action
    console.log("Searching for:", query)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for cryptocurrencies, news, or trends..."
            className="pl-10 bg-gray-700 border-gray-600 text-white h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" className="bg-green-600 hover:bg-green-700 h-12 px-6">
          Search
        </Button>
      </form>
    </div>
  )
}
