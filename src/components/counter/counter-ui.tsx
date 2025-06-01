'use client'

import { Keypair, PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { ellipsify } from '@/lib/utils'
import { useCounterProgram, useCounterProgramAccount } from './counter-data-access'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export function CounterInitialize() {
  const { initialize } = useCounterProgram()

  return (
    <motion.div
      className="flex justify-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => initialize.mutateAsync(Keypair.generate())}
          disabled={initialize.isPending}
          size="lg"
          className="px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {initialize.isPending ? 'Initializing...' : '+ Initialize Counter'}
        </Button>
      </motion.div>
    </motion.div>
  )
}

export function CounterList() {
  const { accounts, getProgramAccount } = useCounterProgram()

  if (getProgramAccount.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!getProgramAccount.data?.value) {
    return (
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Program Not Found</h3>
            <p className="text-gray-600 text-center max-w-md">
              Make sure you have deployed the program and are connected to the correct cluster.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div className="space-y-8" variants={staggerContainer} initial="hidden" animate="visible">
      {accounts.isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : accounts.data?.length ? (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-2xl font-bold text-center mb-6">Active Counters</h2>
            <p className="text-gray-600 text-center mb-8">
              {accounts.data.length} counter{accounts.data.length !== 1 ? 's' : ''} found
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {accounts.data.map((account, i) => (
              <motion.div key={account.publicKey.toString()} custom={i} variants={fadeInUp} className="w-full">
                <CounterCard account={account.publicKey} />
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          className="max-w-lg mx-auto text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Counters Yet</h2>
          <p className="text-lg text-gray-600 mb-6">Get started by creating your first counter above.</p>
        </motion.div>
      )}
    </motion.div>
  )
}

function CounterCard({ account }: { account: PublicKey }) {
  const { accountQuery, incrementMutation, decrementMutation } = useCounterProgramAccount({ account })
  const count = useMemo(() => accountQuery.data?.count ?? 0, [accountQuery.data?.count])

  if (accountQuery.isLoading) {
    return (
      <div className="w-full">
        <Card className="h-48">
          <CardContent className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-200 border-0 bg-secondary-foreground">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold mb-2 text-background">{count.toString()}</CardTitle>
          <CardDescription className="text-sm">
            <ExplorerLink
              path={`account/${account}`}
              label={ellipsify(account.toString(), 8)}
              className="hover:underline font-mono"
            />
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-col space-y-3">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant={'secondary'}
                onClick={() => incrementMutation.mutateAsync()}
                disabled={incrementMutation.isPending}
                className="w-full py-3 font-medium hover:border-2 border-foreground"
                size="lg"
              >
                {incrementMutation.isPending ? '...' : 'Increment'}
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant={'secondary'}
                onClick={() => decrementMutation.mutateAsync()}
                disabled={decrementMutation.isPending}
                className="w-full py-3 font-medium hover:border-2 border-foreground"
                size="lg"
              >
                {decrementMutation.isPending ? '...' : 'Decrement'}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
