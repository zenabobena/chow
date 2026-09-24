import { useState } from 'react';
import { BookOpen, Clock, ListChecks, Plus, Users } from 'lucide-react';
import Modal from './Modal';
import { DAYS, SLOTS, type Day, type Meal, type Slot } from '../types';
import { uid, useStore } from '../store';
import { useToast } from './Toast';
import type { Target } from '../ui';

interface Props {
  meal: Meal;
  target: Target | null;
  onClose: () => void;
  onAdded: (entryId: string, openCheck: boolean) => void;
}

const todayName = (): Day => DAYS[(new Date().getDay() + 6) % 7];

export default function AddMealModal({ meal, target, onClose, onAdded }: Props) {
  const { dispatch } = useStore();
  const toast = useToast();
  const [day, setDay] = useState<Day>(target?.day ?? todayName());
  const [slot, setSlot] = useState<Slot>(
    target?.slot ?? (meal.categories.includes('Breakfast') ? 'Breakfast' : 'Dinner'),
  );
  const [includeRecipe, setIncludeRecipe] = useState(false);

  const add = (openCheck: boolean) => {
    const id = uid();
    dispatch({ type: 'ADD_ENTRY', id, meal, day, slot, includeRecipe });
    toast(`${meal.name} added to ${day} ${slot.toLowerCase()}${includeRecipe ? ' with recipe' : ''}`);
    onAdded(id, openCheck);
  };

  return (
    <Modal
      title={
        <span className="modal-title-row">
          <span className="meal-emoji sm">{meal.emoji}</span> {meal.name}
        </span>
      }
      subtitle={meal.description}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={() => add(true)}>
            <ListChecks size={16} /> Add &amp; check ingredients
          </button>
          <button className="btn btn-primary" onClick={() => add(false)}>
            <Plus size={16} /> Add to {day}
          </button>
        </>
      }
    >
      <div className="meal-meta big">
        <span>
          <Clock size={15} /> {meal.time} min
        </span>
        <span>
          <Users size={15} /> Serves {meal.serves}
        </span>
        <span>{meal.ingredients.length} ingredients</span>
      </div>

      <fieldset className="field">
        <legend>Which day?</legend>
        <div className="pill-row">
          {DAYS.map((d) => (
            <button key={d} className={`pill ${d === day ? 'on' : ''}`} onClick={() => setDay(d)} aria-pressed={d === day}>
              <span className="pill-long">{d}</span>
              <span className="pill-short">{d.slice(0, 3)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>Which meal?</legend>
        <div className="pill-row">
          {SLOTS.map((s) => (
            <button key={s} className={`pill ${s === slot ? 'on' : ''}`} onClick={() => setSlot(s)} aria-pressed={s === slot}>
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <label className={`check-card ${includeRecipe ? 'on' : ''}`}>
        <input type="checkbox" checked={includeRecipe} onChange={(e) => setIncludeRecipe(e.target.checked)} />
        <span className="check-box" aria-hidden />
        <span>
          <strong>
            <BookOpen size={16} /> Get the recipe too
          </strong>
          <span className="muted">
            Attach the step-by-step method to this meal and save it to your Recipes.
          </span>
        </span>
      </label>

      <details className="ing-preview">
        <summary>Preview ingredients</summary>
        <ul>
          {meal.ingredients.map((i) => (
            <li key={i.name}>
              {i.name} <span className="muted">· {i.qty}</span>
            </li>
          ))}
        </ul>
      </details>
    </Modal>
  );
}
