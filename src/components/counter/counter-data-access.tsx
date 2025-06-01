'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useCluster } from '../cluster/cluster-data-access'
import { useTransactionToast } from '../use-transaction-toast'
import { useAnchorProvider } from '../solana/solana-provider'
import { useMemo } from 'react'
import { getCounterProgram, getCounterProgramId } from '@project/anchor'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCounterProgram() {
  // Connection config
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()

  // Anchor Config
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCounterProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCounterProgram(provider, programId), [provider, programId])

  // Get all accounts
  const accounts = useQuery({
    queryKey: ['counter', 'all', { cluster }],
    queryFn: () => program.account.counter.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['counter', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ counter: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: async (signature) => {
      const updatedAccounts = await accounts.refetch() 
      transactionToast(signature)
      return updatedAccounts
    },
    onError: () => toast.error(`Failed to initialize account`),
  })

  return {
    program,
    programId,
    getProgramAccount,
    accounts,
    initialize,
  }
}

export function useCounterProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCounterProgram()

  const accountQuery = useQuery({
    queryKey: ['counter', 'fetch', { cluster, account }],
    queryFn: () => program.account.counter.fetch(account),
  })

  const incrementMutation = useMutation({
    mutationKey: ['counter', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ counter: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      accountQuery.refetch()
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['counter', 'increment', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ counter: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      accountQuery.refetch()
      return accounts.refetch()
    },
  })

  return {
    accountQuery,
    incrementMutation,
    decrementMutation,
  }
}
