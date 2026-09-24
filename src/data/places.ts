export interface Restaurant {
  id: string;
  name: string;
  emoji: string;
  cuisine: string;
  rating: number;
  price: 1 | 2 | 3 | 4;
  distanceKm: number;
  eta: string;
  tags: string[];
  delivery: string[]; // delivery service ids
}

export const RESTAURANTS: Restaurant[] = [
  { id: 'r1', name: 'Nonna’s Trattoria', emoji: '🍕', cuisine: 'Italian', rating: 4.7, price: 2, distanceKm: 1.2, eta: '25–35 min', tags: ['Wood-fired pizza', 'Family friendly'], delivery: ['ubereats', 'deliveroo'] },
  { id: 'r2', name: 'Golden Lotus', emoji: '🥟', cuisine: 'Chinese', rating: 4.5, price: 2, distanceKm: 2.4, eta: '30–40 min', tags: ['Dumplings', 'Late night'], delivery: ['ubereats', 'doordash', 'justeat'] },
  { id: 'r3', name: 'Spice Route', emoji: '🍛', cuisine: 'Indian', rating: 4.6, price: 2, distanceKm: 0.8, eta: '20–30 min', tags: ['Vegetarian options', 'Curry'], delivery: ['deliveroo', 'justeat'] },
  { id: 'r4', name: 'The Salty Anchor', emoji: '🐟', cuisine: 'Seafood', rating: 4.4, price: 3, distanceKm: 3.1, eta: '35–45 min', tags: ['Fish & chips', 'Waterfront'], delivery: ['ubereats'] },
  { id: 'r5', name: 'Taco Loco', emoji: '🌮', cuisine: 'Mexican', rating: 4.3, price: 1, distanceKm: 1.6, eta: '20–30 min', tags: ['Tacos', 'Burritos'], delivery: ['doordash', 'ubereats', 'grubhub'] },
  { id: 'r6', name: 'Sakura House', emoji: '🍣', cuisine: 'Japanese', rating: 4.8, price: 3, distanceKm: 2.0, eta: '30–40 min', tags: ['Sushi', 'Ramen'], delivery: ['deliveroo', 'ubereats'] },
  { id: 'r7', name: 'Green Bowl Co.', emoji: '🥗', cuisine: 'Healthy', rating: 4.5, price: 2, distanceKm: 0.5, eta: '15–25 min', tags: ['Vegan', 'Gluten free'], delivery: ['ubereats', 'doordash'] },
  { id: 'r8', name: 'Smokehouse 88', emoji: '🍖', cuisine: 'BBQ', rating: 4.6, price: 3, distanceKm: 4.2, eta: '40–50 min', tags: ['Brisket', 'Ribs'], delivery: ['grubhub', 'doordash'] },
  { id: 'r9', name: 'Bangkok Street', emoji: '🍜', cuisine: 'Thai', rating: 4.4, price: 1, distanceKm: 1.9, eta: '25–35 min', tags: ['Pad Thai', 'Spicy'], delivery: ['justeat', 'deliveroo', 'grubhub'] },
  { id: 'r10', name: 'Burger Barn', emoji: '🍔', cuisine: 'Burgers', rating: 4.2, price: 1, distanceKm: 1.1, eta: '15–25 min', tags: ['Shakes', 'Loaded fries'], delivery: ['ubereats', 'doordash', 'justeat', 'grubhub'] },
  { id: 'r11', name: 'Le Petit Bistro', emoji: '🥐', cuisine: 'French', rating: 4.7, price: 4, distanceKm: 3.6, eta: '40–55 min', tags: ['Date night', 'Pastries'], delivery: ['deliveroo'] },
  { id: 'r12', name: 'Olive & Fig', emoji: '🧆', cuisine: 'Mediterranean', rating: 4.5, price: 2, distanceKm: 2.7, eta: '30–40 min', tags: ['Falafel', 'Mezze'], delivery: ['ubereats', 'justeat'] },
];

export interface DeliveryService {
  id: string;
  name: string;
  emoji: string;
  color: string;
  url: string;
  blurb: string;
  features: string[];
  regions: string;
}

export const DELIVERY_SERVICES: DeliveryService[] = [
  { id: 'ubereats', name: 'Uber Eats', emoji: '🛵', color: '#06c167', url: 'https://www.ubereats.com', blurb: 'Huge restaurant range plus groceries and convenience items.', features: ['Restaurants', 'Groceries', 'Live tracking'], regions: 'Worldwide' },
  { id: 'deliveroo', name: 'Deliveroo', emoji: '🦘', color: '#00ccbc', url: 'https://deliveroo.com', blurb: 'Popular local restaurants and grocery delivery.', features: ['Restaurants', 'Groceries', 'Subscription'], regions: 'UK, Europe, Middle East & Asia' },
  { id: 'doordash', name: 'DoorDash', emoji: '🚪', color: '#ff3008', url: 'https://www.doordash.com', blurb: 'Restaurants, grocery and retail delivered on demand.', features: ['Restaurants', 'Groceries', 'Pickup'], regions: 'US, Canada, Australia, NZ & more' },
  { id: 'justeat', name: 'Just Eat', emoji: '🍽️', color: '#ff8000', url: 'https://www.just-eat.com', blurb: 'Takeaway favourites from thousands of local spots.', features: ['Restaurants', 'Takeaway', 'Collection'], regions: 'UK, Ireland & Europe' },
  { id: 'grubhub', name: 'Grubhub', emoji: '🥡', color: '#f63440', url: 'https://www.grubhub.com', blurb: 'Local restaurant delivery and pickup across the US.', features: ['Restaurants', 'Pickup', 'Campus dining'], regions: 'United States' },
];
