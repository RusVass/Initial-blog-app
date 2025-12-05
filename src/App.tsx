import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from './components/ui/Button'

function App() {
  const [count, setCount] = useState(0)
  const featureCards: Feature[] = [
    {
      title: 'Tailwind ready',
      description: 'Utility-first styling is configured and ready for use.',
    },
    {
      title: 'Type safety',
      description: 'Strict TypeScript config keeps runtime bugs at bay.',
    },
    {
      title: 'Fast refresh',
      description: 'Vite dev server reloads instantly as you iterate.',
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <section className="w-full max-w-3xl space-y-10 rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-12 text-center shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex items-center justify-center gap-6">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img
              src={viteLogo}
              alt="Vite logo"
              className="h-16 w-16 drop-shadow-[0_0_20px_rgba(99,102,241,0.45)] transition hover:scale-105"
            />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img
              src={reactLogo}
              alt="React logo"
              className="h-16 w-16 drop-shadow-[0_0_20px_rgba(56,189,248,0.45)] transition hover:scale-105"
            />
          </a>
        </div>

        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">
            Ready-to-style starter
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Vite + React + Tailwind
          </h1>
          <p className="text-base text-slate-300">
            Use the counter to verify hot module reloading, then start building
            your UI with Tailwind utilities.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/5 bg-black/20 px-6 py-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
            Interactive counter
          </p>
          <Button size="lg" onClick={() => setCount((value) => value + 1)}>
            Count is {count}
          </Button>
          <p className="text-sm text-slate-400">
            Edit <span className="font-mono text-indigo-300">src/App.tsx</span>{' '}
            and save to test HMR.
          </p>
        </div>

        <ul className="grid gap-4 text-left sm:grid-cols-3">
          {featureCards.map((feature) => (
            <li
              key={feature.title}
              className="rounded-2xl border border-white/5 bg-slate-900/60 p-4"
            >
              <p className="text-sm font-semibold text-white">
                {feature.title}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App

interface Feature {
  title: string
  description: string
}
