import Navbar from '@/components/layout/Navbar'
import ThemeProvider from '@/components/layout/ThemeProvider'
import { SessionProvider } from '@/context/SessionContext'
import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter'
import Toolbar from '@mui/material/Toolbar'
import type { AppProps } from 'next/app'
import { Geist, Geist_Mono } from 'next/font/google'
import Head from 'next/head'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <AppCacheProvider {...props}>
      <Head>
        <title>MediChat - Healthcare Communication Platform</title>
        <meta
          name="description"
          content="Connect with healthcare providers, schedule appointments, and access health information"
        />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <Toolbar />

            <main>
              <Component {...pageProps} />
            </main>
          </ThemeProvider>
        </SessionProvider>
      </div>
    </AppCacheProvider>
  )
}
