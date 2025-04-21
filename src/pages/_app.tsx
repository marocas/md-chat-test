import { AuthProvider } from '@/components/auth/AuthProvider'
import Navbar from '@/components/layout/Navbar'
import ThemeProvider from '@/components/layout/ThemeProvider'
import '@/styles/globals.css'
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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MediChat - Healthcare Communication Platform</title>
        <meta
          name="description"
          content="Connect with healthcare providers, schedule appointments, and access health information"
        />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main>
              <Component {...pageProps} />
            </main>
          </AuthProvider>
        </ThemeProvider>
      </div>
    </>
  )
}
