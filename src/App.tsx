import { lazy, Suspense } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'

// Lazy-load each page so the initial bundle stays small
const Dashboard    = lazy(() => import('@/pages/Dashboard'))
const TierList     = lazy(() => import('@/pages/TierList'))
const BossStrategy = lazy(() => import('@/pages/BossStrategy'))
const TeamBuilder  = lazy(() => import('@/pages/TeamBuilder'))
const Resources    = lazy(() => import('@/pages/Resources'))

const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard'      },
  { to: '/tier-list',  label: 'Animus Tier List'},
  { to: '/bosses',     label: 'Boss Strategy'  },
  { to: '/team',       label: 'Team Builder'   },
  { to: '/resources',  label: 'Resource Tools' },
] as const

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar__brand">HoardMode</div>
      <ul className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Suspense fallback={<div className="page-loading">Loading…</div>}>
          <Routes>
            <Route path="/"          element={<Dashboard />}    />
            <Route path="/tier-list" element={<TierList />}     />
            <Route path="/bosses"    element={<BossStrategy />} />
            <Route path="/team"      element={<TeamBuilder />}  />
            <Route path="/resources" element={<Resources />}    />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
