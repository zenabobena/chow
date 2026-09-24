import { Clock, Heart, Plus, Users } from 'lucide-react';
import type { Meal } from '../types';
import { useStore } from '../store';
import { useUI } from '../ui';

export default function MealCard({ meal, compact }: { meal: Meal; compact?: boolean }) {
  const { state, dispatch } = useStore();
  const { openAddMeal } = useUI();
  const fav = state.favourites.includes(meal.id);

  return (
    <article className={`meal-card ${compact ? 'compact' : ''}`}>
      <button className="meal-card-main" onClick={() => openAddMeal(meal)} aria-label={`Add ${meal.name} to planner`}>
        <div className="meal-emoji" aria-hidden>
          {meal.emoji}
        </div>
        <div className="meal-info">
          <h3>{meal.name}</h3>
          {!compact && <p className="muted clamp-2">{meal.description}</p>}
          <div className="meal-meta">
            <span>
              <Clock size={14} /> {meal.time} min
            </span>
            <span>
              <Users size={14} /> {meal.serves}
            </span>
            {meal.origin && <span className="chip chip-soft">{meal.origin}</span>}
          </div>
        </div>
        <span className="add-pill">
          <Plus size={16} /> Add
        </span>
      </button>
      <button
        className={`fav-btn ${fav ? 'on' : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_FAV', mealId: meal.id, meal })}
        aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
        aria-pressed={fav}
      >
        <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}

export function MealGrid({ meals, empty }: { meals: Meal[]; empty?: React.ReactNode }) {
  if (!meals.length) return <div className="empty">{empty ?? 'Nothing here yet.'}</div>;
  return (
    <div className="meal-grid">
      {meals.map((m) => (
        <MealCard key={m.id} meal={m} />
      ))}
    </div>
  );
}
