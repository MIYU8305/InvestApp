export const metadata = {
  title: 'S&P 500 Dashboard',
  description: 'Investment monitoring dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
