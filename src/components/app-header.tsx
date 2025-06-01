'use client'

import { WalletButton } from '@/components/solana/solana-provider'
import { ThemeSelect } from '@/components/theme-select'
import { Button } from '@/components/ui/button'
import { Github, Menu, X } from 'lucide-react'
import { Bricolage_Grotesque } from 'next/font/google'
import Link from 'next/link'
import { useState } from 'react'
import { ClusterUiSelect } from './cluster/cluster-ui'

const logoFont = Bricolage_Grotesque({ weight: '400', subsets: ['latin'] })

export function AppHeader() {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="relative z-50 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 h-14">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-baseline gap-4">
          <Link className={`text-2xl font-extrabold tracking-tighter ${logoFont.className}`} href="/">
            <span>counter</span>
          </Link>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className="hidden md:flex items-center gap-4">
          <Button variant={"outline"} className='p-2' onClick={() => window.open('https://github.com/priyanshpatel18/counter-dapp', '_blank')}>
            <Github className='h-6 w-6 text-primary' />
          </Button>
          <WalletButton />
          <ClusterUiSelect />
          <ThemeSelect />
        </div>

        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-[52px] bottom-0 bg-neutral-100/95 dark:bg-neutral-900/95 backdrop-blur-sm">
            <div className="flex flex-col p-4 gap-4 border-t dark:border-neutral-800">
              <div className="flex flex-col gap-4">
                <WalletButton />
                <ClusterUiSelect />
                <ThemeSelect />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
