import { useState } from 'react';
import { ChefHat, Heart, Landmark, LayoutGrid, Search, X } from 'lucide-react';
import type { TopTab } from '../types';
import { CATEGORIES } from '../data/meals';
import { entryStatus, useStore } from '../store';
import { useUI } from '../ui';
import { MealGrid } from '../components/MealCard';
import BuildMeal from '../components/BuildMeal';
import WeeklyPlanner from '../components/WeeklyPlanner';

const TABS: { id: TopTab; label: string; icon: typeof Heart }[] = [
  { id: 'favourites', label: 'Favourites', icon: Heart },
  { id: 'traditional', label: 'Traditional', icon: Landmark },
  { id: 'build', label: 'Build a Meal', icon: ChefHat },
  { id: 'categories', label: 'Categories', icon: LayoutGrid },
];

export default function PlannerView() {
  const [tab, setTab] = useState<TopTab>('favourites');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [query, setQuery] = useState('');
  const { state, allMeals, getMeal } = useStore();
  const { target, setTarget, go } = useUI();

  const q = query.trim().toLowerCase();
  const match = (name: string, desc: string) => !q || name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);

  let meals = allMeals;
  if (tab === 'favourites') meals = state.favourites.map((id) => getMeal(id)!).filter(Boolean);
  if (tab === 'traditional') meals = allMeals.filter((m) => m.traditional);
  if (tab === 'categories') meals = allMeals.filter((m) => m.categories.includes(category));
  meals = meals.filter((m) => match(m.name, m.description));

  const missing = state.plan.reduce((n, e) => n + entryStatus(e, getMeal(e.mealId), state.shopping).missing, 0);
  const toBuy = state.shopping.filter((s) => !s.bought).length;
  const withRecipe = state.plan.filter((e) => e.includeRecipe).length;

  return (
    <div className="view">
      <section className="hero">
        <div>
          <p className="eyebrow">What’s for dinner?</p>
          <h1>Plan your week, the easy way.</h1>
          <p className="muted">Choose meals from the menu, grab the recipe, and let CHOW build your shopping list.</p>
        </div>
        <div className="stats">
          <div className="stat">
            <strong>{state.plan.length}</strong>
            <span>meals planned</span>
          </div>
          <div className="stat">
            <strong>{withRecipe}</strong>
            <span>with recipes</span>
          </div>
          <div className={`stat ${missing ? 'warn' : ''}`}>
            <strong>{missing}</strong>
            <span>ingredients missing</span>
          </div>
          <button className="stat stat-link" onClick={() => go('shopping')}>
            <strong>{toBuy}</strong>
            <span>on shopping list →</span>
          </button>
        </div>
      </section>

      <section id="meal-menu" className="menu-panel">
        <nav className="topnav" role="tablist" aria-label="Meal menu">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`topnav-item ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={18} />
              <span>{t.label}</span>
            </button>
          ))}
          {tab !== 'build' && (
            <label className="search">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search meals…" aria-label="Search meals" />
              {query && (
                <button className="icon-btn xs" onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </label>
          )}
        </nav>

        {target && (
          <div className="target-banner">
            <span>
              Choosing <strong>{target.slot.toLowerCase()}</strong> for <strong>{target.day}</strong> — pick a meal below.
            </span>
            <button className="icon-btn xs" onClick={() => setTarget(null)} aria-label="Cancel">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="menu-body">
          {tab === 'categories' && (
            <div className="chip-row" role="group" aria-label="Categories">
              {CATEGORIES.map((c) => (
                <button key={c} className={`chip-btn ${c === category ? 'on' : ''}`} onClick={() => setCategory(c)} aria-pressed={c === category}>
                  {c}
                  <span className="count">{allMeals.filter((m) => m.categories.includes(c)).length}</span>
                </button>
              ))}
            </div>
          )}
          {tab === 'traditional' && (
            <p className="muted panel-intro">Time-honoured classics from around the world.</p>
          )}
          {tab === 'build' ? (
            <BuildMeal />
          ) : (
            <MealGrid
              meals={meals}
              empty={
                q ? (
                  <>No meals match “{query}”.</>
                ) : tab === 'favourites' ? (
                  <>Tap the ♥ on any meal to save it to your favourites.</>
                ) : undefined
              }
            />
          )}
        </div>
      </section>

      <WeeklyPlanner />
    </div>
  );
}
