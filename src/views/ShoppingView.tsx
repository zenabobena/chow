import { useState } from 'react';
import { Check, Copy, Eraser, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import type { Aisle, ShoppingItem } from '../types';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { useUI } from '../ui';

const AISLES: Aisle[] = ['Produce', 'Meat & Seafood', 'Dairy & Eggs', 'Bakery', 'Pantry', 'Spices & Herbs', 'Frozen', 'Other'];
const AISLE_EMOJI: Record<Aisle, string> = {
  Produce: '🥕',
  'Meat & Seafood': '🥩',
  'Dairy & Eggs': '🧀',
  Bakery: '🥖',
  Pantry: '🥫',
  'Spices & Herbs': '🌿',
  Frozen: '🧊',
  Other: '🛒',
};

interface Row {
  key: string;
  name: string;
  items: ShoppingItem[];
}

function groupRows(items: ShoppingItem[]): Row[] {
  const map = new Map<string, Row>();
  for (const it of items) {
    const key = it.name.toLowerCase();
    const row = map.get(key) ?? { key, name: it.name, items: [] };
    row.items.push(it);
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default function ShoppingView() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const { go } = useUI();
  const [mode, setMode] = useState<'aisle' | 'meal'>('aisle');
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [aisle, setAisle] = useState<Aisle>('Other');

  const items = state.shopping;
  const bought = items.filter((i) => i.bought).length;

  const addCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch({ type: 'ADD_CUSTOM_ITEM', name: name.trim(), qty: qty.trim(), aisle });
    toast(`${name.trim()} added`);
    setName('');
    setQty('');
  };

  const copy = async () => {
    const lines = AISLES.flatMap((a) => {
      const rows = groupRows(items.filter((i) => i.aisle === a && !i.bought));
      return rows.length ? [`${a}:`, ...rows.map((r) => `  • ${r.name}${qtyText(r) ? ` (${qtyText(r)})` : ''}`)] : [];
    });
    try {
      await navigator.clipboard.writeText(['CHOW shopping list', ...lines].join('\n'));
      toast('Shopping list copied to clipboard');
    } catch {
      toast('Could not access the clipboard');
    }
  };

  const groups: { title: string; emoji: string; rows: Row[] }[] =
    mode === 'aisle'
      ? AISLES.map((a) => ({ title: a, emoji: AISLE_EMOJI[a], rows: groupRows(items.filter((i) => i.aisle === a)) }))
      : [
          ...[...new Set(items.filter((i) => i.entryId).map((i) => i.entryId!))].map((id) => {
            const its = items.filter((i) => i.entryId === id);
            return { title: `${its[0].mealName} · ${its[0].day}`, emoji: '🍽️', rows: its.map((i) => ({ key: i.id, name: i.name, items: [i] })) };
          }),
          { title: 'Extra items', emoji: '🛒', rows: items.filter((i) => !i.entryId).map((i) => ({ key: i.id, name: i.name, items: [i] })) },
        ];

  return (
    <div className="view">
      <header className="page-head">
        <h1>
          <ShoppingCart size={26} /> Shopping List
        </h1>
        <p className="muted">
          {items.length
            ? `${items.length - bought} to buy · ${bought} in the trolley`
            : 'Missing ingredients from your planned meals will appear here.'}
        </p>
      </header>

      <form className="add-item" onSubmit={addCustom}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add an item, e.g. Coffee" aria-label="Item name" />
        <input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Qty" aria-label="Quantity" className="qty-input" />
        <select value={aisle} onChange={(e) => setAisle(e.target.value as Aisle)} aria-label="Aisle">
          {AISLES.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit" disabled={!name.trim()}>
          <Plus size={16} /> Add
        </button>
      </form>

      {items.length > 0 && (
        <>
          <div className="toolbar">
            <div className="segmented" role="group" aria-label="Group by">
              <button className={mode === 'aisle' ? 'on' : ''} onClick={() => setMode('aisle')}>
                By aisle
              </button>
              <button className={mode === 'meal' ? 'on' : ''} onClick={() => setMode('meal')}>
                By meal
              </button>
            </div>
            <div className="toolbar-actions">
              <button className="btn btn-ghost" onClick={copy}>
                <Copy size={16} /> Copy
              </button>
              <button className="btn btn-ghost" disabled={!bought} onClick={() => dispatch({ type: 'CLEAR_BOUGHT' })}>
                <Eraser size={16} /> Clear bought
              </button>
              <button className="btn btn-danger-ghost" onClick={() => confirm('Empty the whole shopping list?') && dispatch({ type: 'CLEAR_LIST' })}>
                <Trash2 size={16} /> Clear all
              </button>
            </div>
          </div>
          <div className="progress big" aria-label={`${bought} of ${items.length} bought`}>
            <span className="p-have" style={{ width: `${(bought / items.length) * 100}%` }} />
          </div>
        </>
      )}

      {items.length === 0 ? (
        <div className="empty big">
          <div className="empty-emoji">🧺</div>
          <p>Your list is empty.</p>
          <p className="muted">Open a meal in your weekly planner and add any missing ingredients.</p>
          <button className="btn btn-primary" onClick={() => go('planner')}>
            Go to Meal Planner
          </button>
        </div>
      ) : (
        <div className="list-groups">
          {groups
            .filter((g) => g.rows.length)
            .map((g) => (
              <section key={g.title} className="list-group">
                <h3>
                  <span>{g.emoji}</span> {g.title}
                  <span className="count">{g.rows.length}</span>
                </h3>
                <ul>
                  {g.rows.map((r) => {
                    const done = r.items.every((i) => i.bought);
                    const ids = r.items.map((i) => i.id);
                    const sources = r.items.filter((i) => i.mealName).map((i) => `${i.mealName} (${i.day?.slice(0, 3)})`);
                    return (
                      <li key={r.key} className={done ? 'done' : ''}>
                        <button
                          className="tick"
                          onClick={() => dispatch({ type: 'SET_BOUGHT', ids, value: !done })}
                          aria-label={done ? `Mark ${r.name} as not bought` : `Mark ${r.name} as bought`}
                          aria-pressed={done}
                        >
                          {done && <Check size={14} />}
                        </button>
                        <div className="item-body">
                          <span className="item-name">
                            {r.name} {qtyText(r) && <span className="muted">· {qtyText(r)}</span>}
                          </span>
                          {mode === 'aisle' && sources.length > 0 && <span className="item-src">for {sources.join(', ')}</span>}
                        </div>
                        <button className="icon-btn xs" onClick={() => dispatch({ type: 'REMOVE_ITEMS', ids })} aria-label={`Remove ${r.name}`}>
                          <X size={16} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}

function qtyText(r: Row) {
  return r.items
    .map((i) => i.qty)
    .filter(Boolean)
    .join(' + ');
}
