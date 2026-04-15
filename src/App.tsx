import { lazy, Suspense } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'

const Dashboard    = lazy(() => import('@/pages/Dashboard'))
const TierList     = lazy(() => import('@/pages/TierList'))
const BossStrategy = lazy(() => import('@/pages/BossStrategy'))
const TeamBuilder  = lazy(() => import('@/pages/TeamBuilder'))
const Resources    = lazy(() => import('@/pages/Resources'))

const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard',       icon: '◈' },
  { to: '/tier-list',  label: 'Animus Tier List', icon: '⊞' },
  { to: '/bosses',     label: 'Boss Strategy',    icon: '⚔' },
  { to: '/team',       label: 'Team Builder',     icon: '⊕' },
  { to: '/resources',  label: 'Resource Tools',   icon: '◎' },
] as const

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar__brand">
        Hoard<span>Mode</span>
        <div className="sidebar__game-tag">Etheria: Restart</div>
      </div>
      <ul className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__link-icon">{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebar__footer">
        Hyperlink Companion · v0.1
      </div>
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
