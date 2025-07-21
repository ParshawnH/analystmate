import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AnalystMateAI - SEC 10-K Risk Analysis Platform',
  description: 'Upload your SEC 10-K filing and let our AI extract structured risk disclosures across legal, financial, regulatory, and operational categories.',
  keywords: 'SEC 10-K, risk analysis, financial compliance, AI analysis, regulatory compliance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#2a2a2a',
              color: '#fff',
              border: '1px solid #5C8CFF',
            },
          }}
        />
      </body>
    </html>
  )
} 