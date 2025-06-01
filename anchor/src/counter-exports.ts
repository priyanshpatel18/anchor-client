// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import CounterIDL from '../target/idl/anchor_counter.json'
import type { AnchorCounter } from '../target/types/anchor_counter'

// Re-export the generated IDL and type
export { AnchorCounter as Counter, CounterIDL }

// The programId is imported from the program IDL.
export const COUNTER_PROGRAM_ID = new PublicKey(CounterIDL.address)

// This is a helper function to get the Counter Anchor program.
export function getCounterProgram(provider: AnchorProvider, address?: PublicKey): Program<AnchorCounter> {
  return new Program(
    { ...CounterIDL, address: address ? address.toBase58() : CounterIDL.address } as AnchorCounter,
    provider,
  )
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getCounterProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
      return new PublicKey('fJQXo3PFRjoBVKzLU5xsfU8wdJbHBkTkX8oWFbpvvGr')
    case 'testnet':
      // This is the program ID for the Counter program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return COUNTER_PROGRAM_ID
  }
}
