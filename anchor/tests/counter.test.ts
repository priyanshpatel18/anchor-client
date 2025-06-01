import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { AnchorCounter } from '../target/types/anchor_counter'

describe('counter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.AnchorCounter as Program<AnchorCounter>

  const counterKeypair = Keypair.generate()

  it('Initialize Counter', async () => {
    try {
      await program.methods.initialize().accounts({ counter: counterKeypair.publicKey }).signers([counterKeypair]).rpc()

      const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

      expect(currentCount.count.toNumber()).toEqual(0)
    } catch (error) {
      console.error(error)
      throw error
    }
  })

  it('Increment Counter', async () => {
    await program.methods.increment().accounts({ counter: counterKeypair.publicKey, user: payer.publicKey }).rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

    expect(currentCount.count.toNumber()).toEqual(1)
  })

  it('Increment Counter Again', async () => {
    await program.methods.increment().accounts({ counter: counterKeypair.publicKey, user: payer.publicKey }).rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

    expect(currentCount.count.toNumber()).toEqual(2)
  })

  it('Decrement Counter', async () => {
    await program.methods.decrement().accounts({ counter: counterKeypair.publicKey, user: payer.publicKey }).rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

    expect(currentCount.count.toNumber()).toEqual(1)
  })
})
