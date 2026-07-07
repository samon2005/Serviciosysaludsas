import type { Metadata } from 'next'
import { Source_Serif_4, Public_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Servicios y Salud S.A.S.',
  description:
    'Desarrollo de estrategias en salud mental, prevención de conducta suicida, mitigación de SPA y desarrollo social comunitario a nivel nacional.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${sourceSerif4.variable} ${publicSans.variable} min-h-full flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
