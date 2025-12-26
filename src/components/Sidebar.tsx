import { Inbox, Calendar, Trash2, HelpCircle, Archive } from 'lucide-react'
import type { ViewType } from '../types/database'

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const views: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'inbox', label: 'Входящие', icon: <Inbox size={20} /> },
  { id: 'today', label: 'Сегодня', icon: <Calendar size={20} /> },
  { id: 'unplaced', label: 'Без даты', icon: <HelpCircle size={20} /> },
  { id: 'archived', label: 'Архив', icon: <Archive size={20} /> },
  { id: 'trash', label: 'Корзина', icon: <Trash2 size={20} /> },
]

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>Jedi Tasks</h1>
      </div>

      <nav className="nav">
        {views.map((view) => (
          <button
            key={view.id}
            className={`nav-item ${currentView === view.id ? 'active' : ''}`}
            onClick={() => onViewChange(view.id)}
          >
            {view.icon}
            <span>{view.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
