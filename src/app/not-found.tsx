'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NotFound() {
  const router = useRouter()

  return (
    <main className="flex flex-col items-center justify-center h-[calc(100vh-7.5rem)]">
      <motion.div
        className="max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } }}
      >
        <h1 className="text-4xl font-bold text-primary tracking-tight mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">The page you are looking for does not exist.</p>
        <Button onClick={() => router.back()} className="mr-2 cursor-pointer">
          Go Back
        </Button>
        <Button onClick={() => router.push('/')} variant="secondary" className="cursor-pointer">
          Go to Homepage
        </Button>
      </motion.div>
    </main>
  )
}
