"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/accessControl')
  }, [router])

  return (
    <main></main>
  )
}
