import { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import AddMealModal from './components/AddMealModal';
import EntryModal from './components/EntryModal';
import RecipeModal from './components/RecipeModal';
import PlannerView from './views/PlannerView';
import RecipesView from './views/RecipesView';
import RestaurantsView from './views/RestaurantsView';
import DeliveryView from './views/DeliveryView';
import ShoppingView from './views/ShoppingView';
import { UIContext, type Target, type UI } from './ui';
import type { Meal, SideView } from './types';

const VIEWS: Record<SideView, () => React.JSX.Element> = {
  planner: PlannerView,
  recipes: RecipesView,
  restaurants: RestaurantsView,
  delivery: DeliveryView,
  shopping: ShoppingView,
};

const viewFromHash = (): SideView => {
  const h = window.location.hash.replace('#/', '') as SideView;
  return h in VIEWS ? h : 'planner';
};

export default function App() {
  const [view, setView] = useState<SideView>(viewFromHash);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('chow:sidebar') === 'collapsed');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [addMeal, setAddMeal] = useState<Meal | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Meal | null>(null);

  useEffect(() => {
    localStorage.setItem('chow:sidebar', collapsed ? 'collapsed' : 'open');
  }, [collapsed]);

  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = useCallback((v: SideView) => {
    window.location.hash = `/${v}`;
    setView(v);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }, []);

  const ui = useMemo<UI>(
    () => ({
      openAddMeal: (m) => setAddMeal(m),
      openEntry: (id) => setEntryId(id),
      openRecipe: (m) => setRecipe(m),
      target,
      setTarget,
      go,
    }),
    [target, go],
  );

  const View = VIEWS[view];

  return (
    <UIContext.Provider value={ui}>
      <div className={`app ${collapsed ? 'is-collapsed' : ''}`}>
        <Sidebar
          view={view}
          onNavigate={go}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="main">
          <header className="mobile-bar">
            <button className="icon-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <span className="brand-name">CHOW</span>
          </header>
          <main>
            <View />
          </main>
        </div>
      </div>

      {addMeal && (
        <AddMealModal
          meal={addMeal}
          target={target}
          onClose={() => setAddMeal(null)}
          onAdded={(id, openCheck) => {
            setAddMeal(null);
            setTarget(null);
            if (openCheck) setEntryId(id);
          }}
        />
      )}
      {entryId && <EntryModal entryId={entryId} onClose={() => setEntryId(null)} />}
      {recipe && (
        <RecipeModal
          meal={recipe}
          onClose={() => setRecipe(null)}
          onAdd={() => {
            setAddMeal(recipe);
            setRecipe(null);
          }}
        />
      )}
    </UIContext.Provider>
  );
}
