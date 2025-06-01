import { Metadata } from 'next'

const { title, description, ogImage, baseURL } = {
  title: 'Solana Counter dApp - Decentralized Counting Platform',
  description:
    " ",
  baseURL: 'https://counter-dapp.priyanshpatel.com',
  ogImage: `https://counter-dapp.priyanshpatel.com/open-graph.png`,
}

export const siteConfig: Metadata = {
  title,
  description,
  metadataBase: new URL(baseURL),
  openGraph: {
    title,
    description,
    images: [ogImage],
    url: baseURL,
    siteName: 'Solana Counter dApp',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ogImage,
    creator: '@priyansh_ptl18',
    site: '@priyansh_ptl18',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  applicationName: 'Solana Counter dApp',
  alternates: {
    canonical: baseURL,
  },
  keywords: [
    'solana',
    'blockchain',
    'dapp',
    'decentralized application',
    'counter',
    'web3',
    'crypto',
    'smart contract',
    'solana program',
    'react',
    'nextjs',
    'typescript',
    'real-time',
    'priyansh patel',
  ],
  authors: [
    {
      name: 'Priyansh Patel',
      url: 'https://priyanshpatel.com',
    },
  ],
  creator: 'Priyansh Patel',
  publisher: 'Priyansh Patel',
}
