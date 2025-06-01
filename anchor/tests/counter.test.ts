import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { AnchorCounter } from '../target/types/anchor_counter'

describe('counter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const program = anchor.workspace.Counter as Program<AnchorCounter>

  const counter = anchor.web3.Keypair.generate()

  it('Initialize Counter', async () => {
    try {
      await program.methods
        .initialize()
        .accounts({ counter: counter.publicKey, })
        .signers([counter])
        .rpc()

      const currentCount = await program.account.counter.fetch(counter.publicKey)
      console.log('Current count:', currentCount.count)

      expect(currentCount.count).toEqual(0)
    } catch (error) {
      console.error('Initialize error:', error)
      throw error
    }
  })

  it('Increment Counter', async () => {
    await program.methods
      .increment()
      .accounts({ counter: counter.publicKey, user: provider.wallet.publicKey })
      .rpc()

    const currentCount = await program.account.counter.fetch(counter.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Counter Again', async () => {
    await program.methods
      .increment()
      .accounts({ counter: counter.publicKey, user: provider.wallet.publicKey })
      .rpc()

    const currentCount = await program.account.counter.fetch(counter.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Counter', async () => {
    await program.methods
      .decrement()
      .accounts({ counter: counter.publicKey, user: provider.wallet.publicKey })
      .rpc()

    const currentCount = await program.account.counter.fetch(counter.publicKey)

    expect(currentCount.count).toEqual(1)
  })
})
