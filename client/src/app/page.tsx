'use client'
import Image from 'next/image'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()


export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">

      </main>
      <ReactQueryDevtools initialIsOpen={false} />

    </QueryClientProvider>

  )
}
