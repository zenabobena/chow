import { BookOpen, CalendarDays, PanelLeftClose, PanelLeftOpen, ShoppingCart, Store, Truck, X } from 'lucide-react';
import type { SideView } from '../types';
import { useStore } from '../store';

interface Props {
  view: SideView;
  onNavigate: (v: SideView) => void;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const ITEMS: { id: SideView; label: string; icon: typeof BookOpen }[] = [
  { id: 'recipes', label: 'Recipes', icon: BookOpen },
  { id: 'restaurants', label: 'Restaurants', icon: Store },
  { id: 'delivery', label: 'Delivery Services', icon: Truck },
  { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
];

export default function Sidebar({ view, onNavigate, collapsed, onToggle, mobileOpen, onCloseMobile }: Props) {
  const { state } = useStore();
  const toBuy = state.shopping.filter((s) => !s.bought).length;

  const item = (id: SideView, label: string, Icon: typeof BookOpen, badge?: number) => (
    <li key={id}>
      <button
        className={`side-link ${view === id ? 'active' : ''}`}
        onClick={() => onNavigate(id)}
        title={collapsed ? label : undefined}
        aria-current={view === id ? 'page' : undefined}
      >
        <Icon size={20} />
        <span className="side-label">{label}</span>
        {!!badge && <span className="badge">{badge}</span>}
      </button>
    </li>
  );

  return (
    <>
      <div className={`scrim ${mobileOpen ? 'show' : ''}`} onClick={onCloseMobile} />
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="brand">
          <button className="brand-btn" onClick={() => onNavigate('planner')} title="CHOW home">
            <span className="logo">C</span>
            <span className="brand-name">CHOW</span>
          </button>
          <button className="icon-btn side-close" onClick={onCloseMobile} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav>
          <ul>{item('planner', 'Meal Planner', CalendarDays)}</ul>
          <p className="side-heading">Menu</p>
          <ul>{ITEMS.map((i) => item(i.id, i.label, i.icon, i.id === 'shopping' ? toBuy : undefined))}</ul>
        </nav>

        <button className="collapse-btn" onClick={onToggle} aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}>
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          <span className="side-label">Collapse menu</span>
        </button>
      </aside>
    </>
  );
}
