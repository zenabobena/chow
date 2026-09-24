import { useMemo, useState } from 'react';
import { Check, Clock, Heart, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { BUILD_GROUPS, composeMeal, type BuildSelection } from '../data/buildAMeal';
import { useStore } from '../store';
import { useUI } from '../ui';

export default function BuildMeal() {
  const [sel, setSel] = useState<BuildSelection>({ veg: [] });
  const meal = useMemo(() => composeMeal(sel), [sel]);
  const { state, dispatch } = useStore();
  const { openAddMeal } = useUI();
  const fav = meal ? state.favourites.includes(meal.id) : false;

  const pick = (key: keyof BuildSelection, id: string, multi?: boolean) =>
    setSel((s) => {
      if (multi) {
        const v = s.veg.includes(id) ? s.veg.filter((x) => x !== id) : [...s.veg, id];
        return { ...s, veg: v };
      }
      return { ...s, [key]: s[key] === id ? undefined : id };
    });

  const isOn = (key: keyof BuildSelection, id: string) =>
    key === 'veg' ? sel.veg.includes(id) : sel[key] === id;

  return (
    <div className="build">
      <div className="build-groups">
        {BUILD_GROUPS.map((g) => (
          <section key={g.key} className="build-group">
            <header>
              <h3>{g.title}</h3>
              <span className="muted">{g.hint}</span>
            </header>
            <div className="option-row">
              {g.options.map((o) => {
                const on = isOn(g.key, o.id);
                return (
                  <button
                    key={o.id}
                    className={`option ${on ? 'on' : ''}`}
                    onClick={() => pick(g.key, o.id, g.multi)}
                    aria-pressed={on}
                  >
                    <span className="option-emoji">{o.emoji}</span>
                    {o.name}
                    {on && <Check size={14} className="option-check" />}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <aside className="build-preview">
        <div className="preview-card">
          <p className="eyebrow">
            <Sparkles size={14} /> Your meal
          </p>
          {meal ? (
            <>
              <div className="preview-title">
                <span className="meal-emoji sm">{meal.emoji}</span>
                <div>
                  <h3>{meal.name}</h3>
                  <p className="muted">
                    <Clock size={13} /> ~{meal.time} min · serves {meal.serves}
                  </p>
                </div>
              </div>
              <ul className="preview-ings">
                {meal.ingredients.map((i) => (
                  <li key={i.name}>
                    <span>{i.name}</span>
                    <span className="muted">{i.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="preview-actions">
                <button className="btn btn-primary" onClick={() => openAddMeal(meal)}>
                  <Plus size={16} /> Add to planner
                </button>
                <button
                  className={`btn btn-ghost ${fav ? 'fav-on' : ''}`}
                  onClick={() => dispatch({ type: 'TOGGLE_FAV', mealId: meal.id, meal })}
                  aria-pressed={fav}
                >
                  <Heart size={16} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Saved' : 'Favourite'}
                </button>
              </div>
            </>
          ) : (
            <p className="muted">Pick at least a protein and a base to build your meal.</p>
          )}
          {(sel.protein || sel.base || sel.veg.length > 0 || sel.sauce) && (
            <button className="link-btn" onClick={() => setSel({ veg: [] })}>
              <RotateCcw size={14} /> Start over
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
