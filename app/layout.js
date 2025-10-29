export const metadata = {
  title: 'SchröDice40 Quantum Analyzer',
  description: 'Quantum simulation probability analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0a0a0a', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
