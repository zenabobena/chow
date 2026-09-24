import { Bookmark, BookmarkCheck, Clock, Plus, Users } from 'lucide-react';
import Modal from './Modal';
import RecipeSteps from './RecipeSteps';
import type { Meal } from '../types';
import { useStore } from '../store';

export default function RecipeModal({ meal, onClose, onAdd }: { meal: Meal; onClose: () => void; onAdd: () => void }) {
  const { state, dispatch } = useStore();
  const saved = state.savedRecipes.includes(meal.id);
  return (
    <Modal
      wide
      title={
        <span className="modal-title-row">
          <span className="meal-emoji sm">{meal.emoji}</span> {meal.name}
        </span>
      }
      subtitle={meal.description}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'TOGGLE_SAVED_RECIPE', mealId: meal.id, meal })}>
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />} {saved ? 'In my recipes' : 'Save recipe'}
          </button>
          <button className="btn btn-primary" onClick={onAdd}>
            <Plus size={16} /> Add to planner
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
        {meal.origin && <span className="chip chip-soft">{meal.origin}</span>}
        {meal.categories.map((c) => (
          <span key={c} className="chip">
            {c}
          </span>
        ))}
      </div>
      <RecipeSteps meal={meal} />
    </Modal>
  );
}
