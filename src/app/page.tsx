'use client'

import { CounterInitialize, CounterList } from '@/components/counter/counter-ui'
import { motion } from 'framer-motion'
import { Bricolage_Grotesque } from 'next/font/google'

const customFont = Bricolage_Grotesque({ weight: '400', subsets: ['latin'] })

export default function CounterPage() {
  return (
    <div>
      <motion.div
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >

          <h1 className={`text-4xl sm:text-6xl font-bold leading-tight tracking-tighter text-foreground ${customFont.className}`}>Counter DApp</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create and manage your Solana counters with real-time updates and seamless interactions.
          </p>
        </motion.div>

        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CounterInitialize />
          <CounterList />
        </motion.div>
      </motion.div>
    </div>
  )
}
