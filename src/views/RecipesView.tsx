import { useState } from 'react';
import { BookOpen, Clock, Search } from 'lucide-react';
import { CATEGORIES } from '../data/meals';
import type { Meal } from '../types';
import { useStore } from '../store';
import { useUI } from '../ui';

function RecipeRow({ meal, note }: { meal: Meal; note?: string }) {
  const { openRecipe } = useUI();
  return (
    <button className="recipe-card" onClick={() => openRecipe(meal)}>
      <span className="meal-emoji">{meal.emoji}</span>
      <span className="recipe-card-body">
        <strong>{meal.name}</strong>
        <span className="muted clamp-2">{meal.description}</span>
        <span className="meal-meta">
          <span>
            <Clock size={13} /> {meal.time} min
          </span>
          <span>{meal.steps.length} steps</span>
          {note && <span className="chip chip-accent">{note}</span>}
        </span>
      </span>
    </button>
  );
}

export default function RecipesView() {
  const { state, allMeals, getMeal } = useStore();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');

  const planned = new Map<string, string[]>();
  state.plan.filter((e) => e.includeRecipe).forEach((e) => planned.set(e.mealId, [...(planned.get(e.mealId) ?? []), e.day.slice(0, 3)]));
  const mine = state.savedRecipes.map((id) => getMeal(id)!).filter(Boolean);

  const q = query.trim().toLowerCase();
  const all = allMeals.filter(
    (m) =>
      (cat === 'All' || m.categories.includes(cat)) &&
      (!q || m.name.toLowerCase().includes(q) || m.ingredients.some((i) => i.name.toLowerCase().includes(q))),
  );

  return (
    <div className="view">
      <header className="page-head">
        <h1>
          <BookOpen size={26} /> Recipes
        </h1>
        <p className="muted">Recipes you’ve added to your week, plus the full CHOW collection.</p>
      </header>

      <section className="card-section">
        <h2>My recipe book</h2>
        {mine.length ? (
          <div className="recipe-grid">
            {mine.map((m) => (
              <RecipeRow key={m.id} meal={m} note={planned.get(m.id)?.join(', ')} />
            ))}
          </div>
        ) : (
          <div className="empty">
            When you add a meal with <strong>“Get the recipe too”</strong> ticked, it shows up here.
          </div>
        )}
      </section>

      <section className="card-section">
        <div className="section-head">
          <h2>Browse all recipes</h2>
          <label className="search">
            <Search size={16} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or ingredient…" aria-label="Search recipes" />
          </label>
        </div>
        <div className="chip-row">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} className={`chip-btn ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)} aria-pressed={cat === c}>
              {c}
            </button>
          ))}
        </div>
        {all.length ? (
          <div className="recipe-grid">
            {all.map((m) => (
              <RecipeRow key={m.id} meal={m} />
            ))}
          </div>
        ) : (
          <div className="empty">No recipes match your search.</div>
        )}
      </section>
    </div>
  );
}
