import { useState } from 'react';
import { MapPin, Search, Star, Store, Clock } from 'lucide-react';
import { DELIVERY_SERVICES, RESTAURANTS } from '../data/places';
import { useUI } from '../ui';

const SORTS = { rating: 'Top rated', distance: 'Nearest', price: 'Cheapest' } as const;

export default function RestaurantsView() {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [sort, setSort] = useState<keyof typeof SORTS>('rating');
  const { go } = useUI();
  const cuisines = ['All', ...new Set(RESTAURANTS.map((r) => r.cuisine))];
  const q = query.trim().toLowerCase();

  const list = RESTAURANTS.filter(
    (r) =>
      (cuisine === 'All' || r.cuisine === cuisine) &&
      (!q || r.name.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)) || r.cuisine.toLowerCase().includes(q)),
  ).sort((a, b) => (sort === 'rating' ? b.rating - a.rating : sort === 'distance' ? a.distanceKm - b.distanceKm : a.price - b.price));

  return (
    <div className="view">
      <header className="page-head">
        <h1>
          <Store size={26} /> Restaurants
        </h1>
        <p className="muted">Night off from cooking? Find somewhere great nearby.</p>
      </header>

      <div className="toolbar">
        <label className="search grow">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search restaurants, dishes…" aria-label="Search restaurants" />
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} aria-label="Sort">
          {Object.entries(SORTS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="chip-row">
        {cuisines.map((c) => (
          <button key={c} className={`chip-btn ${cuisine === c ? 'on' : ''}`} onClick={() => setCuisine(c)} aria-pressed={cuisine === c}>
            {c}
          </button>
        ))}
      </div>

      <div className="place-grid">
        {list.map((r) => (
          <article key={r.id} className="place-card">
            <div className="place-banner">{r.emoji}</div>
            <div className="place-body">
              <div className="place-title">
                <h3>{r.name}</h3>
                <span className="rating">
                  <Star size={14} fill="currentColor" /> {r.rating.toFixed(1)}
                </span>
              </div>
              <p className="muted">
                {r.cuisine} · {'$'.repeat(r.price)}
                <span className="faded">{'$'.repeat(4 - r.price)}</span>
              </p>
              <div className="meal-meta">
                <span>
                  <MapPin size={13} /> {r.distanceKm} km
                </span>
                <span>
                  <Clock size={13} /> {r.eta}
                </span>
              </div>
              <div className="tag-row">
                {r.tags.map((t) => (
                  <span key={t} className="chip chip-soft">
                    {t}
                  </span>
                ))}
              </div>
              <div className="order-row">
                <span className="muted small">Order via</span>
                {r.delivery.map((d) => {
                  const svc = DELIVERY_SERVICES.find((s) => s.id === d)!;
                  return (
                    <button key={d} className="svc-tag" style={{ '--svc': svc.color } as React.CSSProperties} onClick={() => go('delivery')}>
                      {svc.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
        {!list.length && <div className="empty">No restaurants match your filters.</div>}
      </div>
      <p className="muted small disclaimer">Restaurant listings are sample data for demonstration.</p>
    </div>
  );
}
