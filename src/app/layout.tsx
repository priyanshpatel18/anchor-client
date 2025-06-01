import { AppLayout } from '@/components/app-layout'
import { AppProviders } from '@/components/app-providers'
import { siteConfig } from '@/config/siteConfig'
import React from 'react'
import './globals.css'
import { Ubuntu } from 'next/font/google'

export const metadata = siteConfig;

const ubuntu = Ubuntu({ weight: '400', subsets: ['latin'] })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${ubuntu.className}`}>
        <AppProviders>
          <AppLayout>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
