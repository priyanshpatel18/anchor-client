import type { MetadataRoute } from 'next'

const { appName, description } = {
  appName: 'Solana Counter dApp - Decentralized Counting Platform',
  description:
    "A modern decentralized application built on Solana blockchain for creating and managing counters. Experience real-time counting with seamless Web3 interactions, powered by Solana's fast and low-cost infrastructure.",
}

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description: description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
