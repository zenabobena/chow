import { useEffect, useState } from 'react';
import { BookOpen, Check, CircleCheck, ListChecks, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Modal from './Modal';
import RecipeSteps from './RecipeSteps';
import { DAYS, SLOTS, type Day, type Slot } from '../types';
import { entryStatus, useStore } from '../store';
import { useToast } from './Toast';

export default function EntryModal({ entryId, onClose }: { entryId: string; onClose: () => void }) {
  const { state, dispatch, getMeal } = useStore();
  const toast = useToast();
  const entry = state.plan.find((e) => e.id === entryId);
  const meal = entry ? getMeal(entry.mealId) : undefined;
  const [tab, setTab] = useState<'ingredients' | 'recipe'>('ingredients');

  useEffect(() => {
    if (entry && !entry.checked) dispatch({ type: 'MARK_CHECKED', entryId: entry.id });
  }, [entry, dispatch]);

  if (!entry || !meal) return null;
  const st = entryStatus(entry, meal, state.shopping);
  const listItem = (name: string) => state.shopping.find((s) => s.entryId === entry.id && s.name === name);
  const missing = meal.ingredients.filter((i) => !entry.have[i.name] && !listItem(i.name));

  const addMissing = () => {
    dispatch({ type: 'ADD_TO_LIST', entryId: entry.id, ingredients: missing });
    toast(`${missing.length} item${missing.length === 1 ? '' : 's'} added to your shopping list`);
  };

  return (
    <Modal
      wide
      title={
        <span className="modal-title-row">
          <span className="meal-emoji sm">{meal.emoji}</span> {meal.name}
        </span>
      }
      subtitle={`${entry.day} · ${entry.slot}`}
      onClose={onClose}
      footer={
        <>
          <div className="move">
            <label className="muted" htmlFor="move-day">
              Move to
            </label>
            <select
              id="move-day"
              value={entry.day}
              onChange={(e) => dispatch({ type: 'MOVE_ENTRY', id: entry.id, day: e.target.value as Day, slot: entry.slot })}
            >
              {DAYS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              aria-label="Meal slot"
              value={entry.slot}
              onChange={(e) => dispatch({ type: 'MOVE_ENTRY', id: entry.id, day: entry.day, slot: e.target.value as Slot })}
            >
              {SLOTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-danger-ghost"
            onClick={() => {
              dispatch({ type: 'REMOVE_ENTRY', id: entry.id });
              toast(`${meal.name} removed from ${entry.day}`);
              onClose();
            }}
          >
            <Trash2 size={16} /> Remove
          </button>
        </>
      }
    >
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'ingredients'} className={tab === 'ingredients' ? 'on' : ''} onClick={() => setTab('ingredients')}>
          <ListChecks size={16} /> Ingredients
        </button>
        <button role="tab" aria-selected={tab === 'recipe'} className={tab === 'recipe' ? 'on' : ''} onClick={() => setTab('recipe')}>
          <BookOpen size={16} /> Recipe {entry.includeRecipe ? '' : <span className="chip chip-soft">not added</span>}
        </button>
      </div>

      {tab === 'ingredients' ? (
        <div className="checker">
          <div className={`checker-summary ${st.ready ? 'ok' : ''}`}>
            {st.ready ? (
              <p>
                <CircleCheck size={18} /> You’re all set — you have everything for this meal.
              </p>
            ) : (
              <p>
                Tick what you already have. Anything you’re missing can go straight to your shopping list.
              </p>
            )}
            <div className="progress" aria-hidden>
              <span className="p-have" style={{ width: `${((st.have + st.bought) / st.total) * 100}%` }} />
              <span className="p-list" style={{ width: `${(st.onList / st.total) * 100}%` }} />
            </div>
            <div className="legend">
              <span><i className="dot have" /> Have {st.have + st.bought}</span>
              <span><i className="dot list" /> On list {st.onList}</span>
              <span><i className="dot miss" /> Missing {st.missing}</span>
            </div>
          </div>

          <div className="checker-actions">
            <button
              className="btn btn-ghost"
              onClick={() => {
                dispatch({ type: 'SET_ALL_HAVE', entryId: entry.id, names: meal.ingredients.map((i) => i.name), value: true });
                toast('Great — marked all ingredients as in stock');
              }}
            >
              <Check size={16} /> I have everything
            </button>
            <button className="btn btn-primary" disabled={!missing.length} onClick={addMissing}>
              <ShoppingCart size={16} /> Add {missing.length || ''} missing to list
            </button>
          </div>

          <ul className="ing-list">
            {meal.ingredients.map((ing) => {
              const have = !!entry.have[ing.name];
              const item = listItem(ing.name);
              return (
                <li key={ing.name} className={have ? 'have' : item ? (item.bought ? 'have' : 'listed') : 'missing'}>
                  <label className="ing-check">
                    <input
                      type="checkbox"
                      checked={have}
                      onChange={(e) => dispatch({ type: 'SET_HAVE', entryId: entry.id, name: ing.name, value: e.target.checked })}
                    />
                    <span className="check-box" aria-hidden />
                    <span className="ing-name">{ing.name}</span>
                    <span className="ing-qty muted">{ing.qty}</span>
                  </label>
                  {have ? (
                    <span className="ing-state muted">Got it</span>
                  ) : item?.bought ? (
                    <span className="ing-state ok">
                      <Check size={14} /> Bought
                    </span>
                  ) : item ? (
                    <button
                      className="list-btn on"
                      onClick={() => dispatch({ type: 'REMOVE_FROM_LIST', entryId: entry.id, name: ing.name })}
                      title="Remove from shopping list"
                    >
                      <ShoppingCart size={14} /> On list
                    </button>
                  ) : (
                    <button
                      className="list-btn"
                      onClick={() => {
                        dispatch({ type: 'ADD_TO_LIST', entryId: entry.id, ingredients: [ing] });
                        toast(`${ing.name} added to shopping list`);
                      }}
                    >
                      <Plus size={14} /> Add to list
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : entry.includeRecipe ? (
        <RecipeSteps meal={meal} />
      ) : (
        <div className="empty">
          <p>You didn’t add the recipe for this meal.</p>
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'SET_INCLUDE_RECIPE', id: entry.id, value: true })}>
            <BookOpen size={16} /> Get the recipe
          </button>
        </div>
      )}
    </Modal>
  );
}
