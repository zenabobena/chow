import { ExternalLink, Truck } from 'lucide-react';
import { DELIVERY_SERVICES, RESTAURANTS } from '../data/places';

export default function DeliveryView() {
  return (
    <div className="view">
      <header className="page-head">
        <h1>
          <Truck size={26} /> Delivery Services
        </h1>
        <p className="muted">Get meals or groceries brought to your door.</p>
      </header>

      <div className="svc-grid">
        {DELIVERY_SERVICES.map((s) => {
          const count = RESTAURANTS.filter((r) => r.delivery.includes(s.id)).length;
          return (
            <article key={s.id} className="svc-card" style={{ '--svc': s.color } as React.CSSProperties}>
              <div className="svc-head">
                <span className="svc-logo">{s.emoji}</span>
                <div>
                  <h3>{s.name}</h3>
                  <p className="muted small">{s.regions}</p>
                </div>
              </div>
              <p>{s.blurb}</p>
              <div className="tag-row">
                {s.features.map((f) => (
                  <span key={f} className="chip chip-soft">
                    {f}
                  </span>
                ))}
              </div>
              <div className="svc-foot">
                <span className="muted small">
                  {count} CHOW restaurant{count === 1 ? '' : 's'}
                </span>
                <a className="btn btn-svc" href={s.url} target="_blank" rel="noreferrer">
                  Open {s.name} <ExternalLink size={14} />
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <p className="muted small disclaimer">Availability varies by location. Links open the service’s official website.</p>
    </div>
  );
}
