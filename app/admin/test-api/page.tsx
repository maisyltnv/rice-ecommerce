"use client"

import React, { useState } from "react"
import { getAllProducts } from "@/lib/products-api"

export default function TestApiPage() {
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const testApi = async () => {
        setLoading(true)
        try {
            const response = await getAllProducts()
            setResult(response)
        } catch (error) {
            setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

            <button
                onClick={testApi}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {loading ? "Testing..." : "Test Products API"}
            </button>

            {result && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="font-bold mb-2">Result:</h2>
                    <pre className="bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}
