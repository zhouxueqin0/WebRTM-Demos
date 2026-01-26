import './globals.css'

export const metadata = {
  title: 'Next.js Demo',
  description: 'Next.js demo application'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
