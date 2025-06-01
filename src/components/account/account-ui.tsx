'use client'

import { motion } from 'framer-motion'

import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useQueryClient } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'

import { AppModal } from '@/components/app-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ellipsify } from '@/lib/utils'
import { useCluster } from '../cluster/cluster-data-access'
import { ExplorerLink } from '../cluster/cluster-ui'
import { Card, CardContent } from '../ui/card'
import {
  useGetBalance,
  useGetSignatures,
  useGetTokenAccounts,
  useRequestAirdrop,
  useTransferSol,
} from './account-data-access'

export function AccountBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address })

  return (
    <h1 className="text-5xl font-bold cursor-pointer" onClick={() => query.refetch()}>
      {query.data ? <BalanceSol balance={query.data} /> : '...'} SOL
    </h1>
  )
}

export function AccountChecker() {
  const { publicKey } = useWallet()
  if (!publicKey) {
    return null
  }
  return <AccountBalanceCheck address={publicKey} />
}

export function AccountBalanceCheck({ address }: { address: PublicKey }) {
  const { cluster } = useCluster()
  const mutation = useRequestAirdrop({ address })
  const query = useGetBalance({ address })

  if (query.isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6"
      >
        <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/30">
          <CardContent className="flex items-center justify-center py-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Checking account balance...</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <motion.div
        className="flex justify-center mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg max-w-md">
          <CardContent className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-amber-900 mb-3">Account Not Found</h3>

            <p className="text-amber-800 mb-6 leading-relaxed text-sm">
              You are connected to <strong>{cluster.name}</strong> but your account is not found on this cluster.
            </p>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => mutation.mutateAsync(1).catch((err) => console.log(err))}
                disabled={mutation.isPending}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {mutation.isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Requesting...</span>
                  </div>
                ) : (
                  'Request Airdrop'
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return null
}

export function AccountButtons({ address }: { address: PublicKey }) {
  const { cluster } = useCluster()
  return (
    <div>
      <div className="space-x-2">
        {cluster.network?.includes('mainnet') ? null : <ModalAirdrop address={address} />}
        <ModalSend address={address} />
        <ModalReceive address={address} />
      </div>
    </div>
  )
}

export function AccountTokens({ address }: { address: PublicKey }) {
  const [showAll, setShowAll] = useState(false)
  const query = useGetTokenAccounts({ address })
  const client = useQueryClient()
  const items = useMemo(() => {
    if (showAll) return query.data
    return query.data?.slice(0, 5)
  }, [query.data, showAll])

  return (
    <div className="space-y-2">
      <div className="justify-between">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Token Accounts</h2>
          <div className="space-x-2">
            {query.isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Button
                variant="outline"
                onClick={async () => {
                  await query.refetch()
                  await client.invalidateQueries({
                    queryKey: ['getTokenAccountBalance'],
                  })
                }}
              >
                <RefreshCw size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
      {query.isError && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}
      {query.isSuccess && (
        <div>
          {query.data.length === 0 ? (
            <div>No token accounts found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Public Key</TableHead>
                  <TableHead>Mint</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map(({ account, pubkey }) => (
                  <TableRow key={pubkey.toString()}>
                    <TableCell>
                      <div className="flex space-x-2">
                        <span className="font-mono">
                          <ExplorerLink label={ellipsify(pubkey.toString())} path={`account/${pubkey.toString()}`} />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <span className="font-mono">
                          <ExplorerLink
                            label={ellipsify(account.data.parsed.info.mint)}
                            path={`account/${account.data.parsed.info.mint.toString()}`}
                          />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono">{account.data.parsed.info.tokenAmount.uiAmount}</span>
                    </TableCell>
                  </TableRow>
                ))}

                {(query.data?.length ?? 0) > 5 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Show Less' : 'Show All'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  )
}

export function AccountTransactions({ address }: { address: PublicKey }) {
  const query = useGetSignatures({ address })
  const [showAll, setShowAll] = useState(false)

  const items = useMemo(() => {
    if (showAll) return query.data
    return query.data?.slice(0, 5)
  }, [query.data, showAll])

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <div className="space-x-2">
          {query.isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <Button variant="outline" onClick={() => query.refetch()}>
              <RefreshCw size={16} />
            </Button>
          )}
        </div>
      </div>
      {query.isError && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}
      {query.isSuccess && (
        <div>
          {query.data.length === 0 ? (
            <div>No transactions found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Signature</TableHead>
                  <TableHead className="text-right">Slot</TableHead>
                  <TableHead>Block Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.signature}>
                    <TableHead className="font-mono">
                      <ExplorerLink path={`tx/${item.signature}`} label={ellipsify(item.signature, 8)} />
                    </TableHead>
                    <TableCell className="font-mono text-right">
                      <ExplorerLink path={`block/${item.slot}`} label={item.slot.toString()} />
                    </TableCell>
                    <TableCell>{new Date((item.blockTime ?? 0) * 1000).toISOString()}</TableCell>
                    <TableCell className="text-right">
                      {item.err ? (
                        <span className="text-red-500" title={item.err.toString()}>
                          Failed
                        </span>
                      ) : (
                        <span className="text-green-500">Success</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(query.data?.length ?? 0) > 5 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Show Less' : 'Show All'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  )
}

function BalanceSol({ balance }: { balance: number }) {
  return <span>{Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000}</span>
}

function ModalReceive({ address }: { address: PublicKey }) {
  return (
    <AppModal title="Receive">
      <p>Receive assets by sending them to your public key:</p>
      <code>{address.toString()}</code>
    </AppModal>
  )
}

function ModalAirdrop({ address }: { address: PublicKey }) {
  const mutation = useRequestAirdrop({ address })
  const [amount, setAmount] = useState('2')

  return (
    <AppModal
      title="Airdrop"
      submitDisabled={!amount || mutation.isPending}
      submitLabel="Request Airdrop"
      submit={() => mutation.mutateAsync(parseFloat(amount))}
    >
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={mutation.isPending}
        id="amount"
        min="1"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="any"
        type="number"
        value={amount}
      />
    </AppModal>
  )
}

function ModalSend({ address }: { address: PublicKey }) {
  const wallet = useWallet()
  const mutation = useTransferSol({ address })
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('1')

  if (!address || !wallet.sendTransaction) {
    return <div>Wallet not connected</div>
  }

  return (
    <AppModal
      title="Send"
      submitDisabled={!destination || !amount || mutation.isPending}
      submitLabel="Send"
      submit={() => {
        mutation.mutateAsync({
          destination: new PublicKey(destination),
          amount: parseFloat(amount),
        })
      }}
    >
      <Label htmlFor="destination">Destination</Label>
      <Input
        disabled={mutation.isPending}
        id="destination"
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Destination"
        type="text"
        value={destination}
      />
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={mutation.isPending}
        id="amount"
        min="1"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="any"
        type="number"
        value={amount}
      />
    </AppModal>
  )
}
