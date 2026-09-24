import { BookOpen, CalendarDays, CircleAlert, CircleCheck, ListChecks, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { DAYS, SLOTS, type Day, type PlanEntry, type Slot } from '../types';
import { entryStatus, useStore } from '../store';
import { useUI } from '../ui';

function weekDates() {
  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset);
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), isToday: i === mondayOffset };
  });
}

export default function WeeklyPlanner() {
  const { state, dispatch } = useStore();
  const { setTarget, target } = useUI();
  const dates = weekDates();

  const pickFor = (day: Day, slot: Slot) => {
    setTarget({ day, slot });
    document.getElementById('meal-menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const planned = state.plan.length;
  return (
    <section className="planner" aria-labelledby="planner-title">
      <header className="section-head">
        <div>
          <h2 id="planner-title">
            <CalendarDays size={22} /> Weekly Meal Planner
          </h2>
          <p className="muted">
            {planned
              ? `${planned} meal${planned === 1 ? '' : 's'} planned this week. Tap a meal to check ingredients.`
              : 'Pick meals from the menu above, or tap + on any day to fill that slot.'}
          </p>
        </div>
        {planned > 0 && (
          <button
            className="btn btn-ghost"
            onClick={() => confirm('Clear every meal from this week?') && dispatch({ type: 'CLEAR_WEEK' })}
          >
            <Trash2 size={16} /> Clear week
          </button>
        )}
      </header>

      <div className="week">
        {DAYS.map((day, i) => {
          const dayEntries = state.plan.filter((e) => e.day === day);
          return (
            <div key={day} className={`day ${dates[i].isToday ? 'today' : ''}`}>
              <div className="day-head">
                <span className="day-name">{day}</span>
                <span className="day-date">
                  {dates[i].isToday ? 'Today · ' : ''}
                  {dates[i].label}
                </span>
              </div>
              {SLOTS.map((slot) => {
                const entries = dayEntries.filter((e) => e.slot === slot);
                const isTarget = target?.day === day && target.slot === slot;
                return (
                  <div key={slot} className={`slot ${isTarget ? 'targeted' : ''}`}>
                    <div className="slot-head">
                      <span>{slot}</span>
                      <button
                        className="slot-add"
                        onClick={() => pickFor(day, slot)}
                        aria-label={`Add ${slot.toLowerCase()} for ${day}`}
                        title={`Add ${slot.toLowerCase()} for ${day}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {entries.map((e) => (
                      <EntryChip key={e.id} entry={e} />
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EntryChip({ entry }: { entry: PlanEntry }) {
  const { state, getMeal } = useStore();
  const { openEntry } = useUI();
  const meal = getMeal(entry.mealId);
  if (!meal) return null;
  const st = entryStatus(entry, meal, state.shopping);

  let status;
  if (st.ready)
    status = (
      <span className="status ok">
        <CircleCheck size={13} /> All ingredients
      </span>
    );
  else if (!entry.checked)
    status = (
      <span className="status neutral">
        <ListChecks size={13} /> Check ingredients
      </span>
    );
  else if (st.missing > 0)
    status = (
      <span className="status warn">
        <CircleAlert size={13} /> {st.missing} missing
      </span>
    );
  else
    status = (
      <span className="status info">
        <ShoppingCart size={13} /> {st.onList} on list
      </span>
    );

  return (
    <button className="entry" onClick={() => openEntry(entry.id)}>
      <span className="entry-emoji">{meal.emoji}</span>
      <span className="entry-body">
        <span className="entry-name">{meal.name}</span>
        <span className="entry-meta">
          {status}
          {entry.includeRecipe && (
            <span className="recipe-flag" title="Recipe included">
              <BookOpen size={13} />
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
