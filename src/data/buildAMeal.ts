import type { Ingredient, Meal } from '../types';

export interface MealComponent {
  id: string;
  name: string;
  emoji: string;
  ingredients: Ingredient[];
  step: string;
  time: number;
  vegetarian?: boolean;
}

export interface ComponentGroup {
  key: 'protein' | 'base' | 'veg' | 'sauce';
  title: string;
  hint: string;
  multi?: boolean;
  options: MealComponent[];
}

export const BUILD_GROUPS: ComponentGroup[] = [
  {
    key: 'protein',
    title: '1. Pick a protein',
    hint: 'Choose one',
    options: [
      { id: 'chicken', name: 'Chicken', emoji: '🍗', time: 15, ingredients: [{ name: 'Chicken breast', qty: '400 g', aisle: 'Meat & Seafood' }], step: 'Slice the chicken, season well and pan-fry for 6–7 minutes until cooked through.' },
      { id: 'beef', name: 'Beef strips', emoji: '🥩', time: 10, ingredients: [{ name: 'Beef stir-fry strips', qty: '400 g', aisle: 'Meat & Seafood' }], step: 'Sear the beef strips in a very hot pan for 2–3 minutes; set aside.' },
      { id: 'salmon', name: 'Salmon', emoji: '🐟', time: 12, ingredients: [{ name: 'Salmon fillets', qty: '2', aisle: 'Meat & Seafood' }], step: 'Pan-fry salmon skin-side down for 4 minutes, flip and cook 2–3 minutes more.' },
      { id: 'prawns', name: 'Prawns', emoji: '🦐', time: 6, ingredients: [{ name: 'Prawns', qty: '300 g', aisle: 'Meat & Seafood' }], step: 'Cook prawns in a hot pan for 2 minutes each side until pink.' },
      { id: 'tofu', name: 'Tofu', emoji: '🧈', time: 12, vegetarian: true, ingredients: [{ name: 'Firm tofu', qty: '400 g', aisle: 'Produce' }], step: 'Press and cube the tofu, then fry until golden on all sides.' },
      { id: 'eggs', name: 'Eggs', emoji: '🥚', time: 8, vegetarian: true, ingredients: [{ name: 'Eggs', qty: '4', aisle: 'Dairy & Eggs' }], step: 'Soft-boil or fry the eggs to your liking.' },
      { id: 'chickpeas', name: 'Chickpeas', emoji: '🫘', time: 8, vegetarian: true, ingredients: [{ name: 'Chickpeas', qty: '400 g tin', aisle: 'Pantry' }], step: 'Drain and rinse chickpeas, then toast in a pan with a little oil and paprika.' },
    ],
  },
  {
    key: 'base',
    title: '2. Pick a base',
    hint: 'Choose one',
    options: [
      { id: 'rice', name: 'Rice', emoji: '🍚', time: 15, vegetarian: true, ingredients: [{ name: 'Jasmine rice', qty: '250 g', aisle: 'Pantry' }], step: 'Rinse and cook the rice according to the packet.' },
      { id: 'pasta', name: 'Pasta', emoji: '🍝', time: 12, vegetarian: true, ingredients: [{ name: 'Penne', qty: '250 g', aisle: 'Pantry' }], step: 'Boil the pasta in salted water until al dente.' },
      { id: 'noodles', name: 'Noodles', emoji: '🍜', time: 5, vegetarian: true, ingredients: [{ name: 'Egg noodles', qty: '300 g', aisle: 'Pantry' }], step: 'Cook noodles in boiling water for 3–4 minutes and drain.' },
      { id: 'potatoes', name: 'Potatoes', emoji: '🥔', time: 30, vegetarian: true, ingredients: [{ name: 'Baby potatoes', qty: '600 g', aisle: 'Produce' }], step: 'Halve the potatoes and roast at 200°C for 30 minutes until crisp.' },
      { id: 'quinoa', name: 'Quinoa', emoji: '🌾', time: 15, vegetarian: true, ingredients: [{ name: 'Quinoa', qty: '200 g', aisle: 'Pantry' }], step: 'Rinse quinoa and simmer in twice its volume of water for 12–15 minutes.' },
      { id: 'wraps', name: 'Wraps', emoji: '🌯', time: 2, vegetarian: true, ingredients: [{ name: 'Tortilla wraps', qty: '6', aisle: 'Bakery' }], step: 'Warm the wraps in a dry pan for 20 seconds each side.' },
      { id: 'greens', name: 'Salad greens', emoji: '🥬', time: 2, vegetarian: true, ingredients: [{ name: 'Mixed salad leaves', qty: '150 g', aisle: 'Produce' }], step: 'Wash and dry the salad leaves.' },
    ],
  },
  {
    key: 'veg',
    title: '3. Add vegetables',
    hint: 'Choose as many as you like',
    multi: true,
    options: [
      { id: 'broccoli', name: 'Broccoli', emoji: '🥦', time: 4, vegetarian: true, ingredients: [{ name: 'Broccoli', qty: '1 head', aisle: 'Produce' }], step: 'Cut broccoli into florets and steam for 3–4 minutes.' },
      { id: 'capsicum', name: 'Capsicum', emoji: '🫑', time: 4, vegetarian: true, ingredients: [{ name: 'Capsicum', qty: '1', aisle: 'Produce' }], step: 'Slice the capsicum and sauté until just tender.' },
      { id: 'spinach', name: 'Spinach', emoji: '🥬', time: 2, vegetarian: true, ingredients: [{ name: 'Baby spinach', qty: '100 g', aisle: 'Produce' }], step: 'Wilt the spinach in the pan at the last minute.' },
      { id: 'carrot', name: 'Carrot', emoji: '🥕', time: 5, vegetarian: true, ingredients: [{ name: 'Carrot', qty: '2', aisle: 'Produce' }], step: 'Julienne or grate the carrots.' },
      { id: 'mushrooms', name: 'Mushrooms', emoji: '🍄', time: 5, vegetarian: true, ingredients: [{ name: 'Mushrooms', qty: '200 g', aisle: 'Produce' }], step: 'Slice mushrooms and fry until golden.' },
      { id: 'zucchini', name: 'Zucchini', emoji: '🥒', time: 5, vegetarian: true, ingredients: [{ name: 'Zucchini', qty: '1', aisle: 'Produce' }], step: 'Slice zucchini into half-moons and sauté for 4 minutes.' },
      { id: 'tomato', name: 'Cherry tomatoes', emoji: '🍅', time: 2, vegetarian: true, ingredients: [{ name: 'Cherry tomatoes', qty: '200 g', aisle: 'Produce' }], step: 'Halve the cherry tomatoes.' },
      { id: 'corn', name: 'Corn', emoji: '🌽', time: 3, vegetarian: true, ingredients: [{ name: 'Corn kernels', qty: '1 cup', aisle: 'Frozen' }], step: 'Warm the corn kernels through.' },
    ],
  },
  {
    key: 'sauce',
    title: '4. Finish with a sauce',
    hint: 'Choose one',
    options: [
      { id: 'teriyaki', name: 'Teriyaki', emoji: '🍯', time: 2, vegetarian: true, ingredients: [{ name: 'Teriyaki sauce', qty: '1/3 cup', aisle: 'Pantry' }], step: 'Toss everything with teriyaki sauce and let it bubble until glossy.' },
      { id: 'pesto', name: 'Pesto', emoji: '🌿', time: 1, vegetarian: true, ingredients: [{ name: 'Basil pesto', qty: '1/3 cup', aisle: 'Pantry' }], step: 'Stir through the pesto with a splash of cooking water.' },
      { id: 'tomato-sauce', name: 'Rich tomato', emoji: '🥫', time: 10, vegetarian: true, ingredients: [{ name: 'Passata', qty: '500 ml', aisle: 'Pantry' }, { name: 'Garlic', qty: '2 cloves', aisle: 'Produce' }], step: 'Simmer passata with crushed garlic for 10 minutes and season.' },
      { id: 'curry', name: 'Coconut curry', emoji: '🥥', time: 10, vegetarian: true, ingredients: [{ name: 'Coconut milk', qty: '400 ml', aisle: 'Pantry' }, { name: 'Curry paste', qty: '2 tbsp', aisle: 'Pantry' }], step: 'Fry curry paste for a minute, add coconut milk and simmer 8 minutes.' },
      { id: 'lemon-herb', name: 'Lemon & herb', emoji: '🍋', time: 2, vegetarian: true, ingredients: [{ name: 'Lemon', qty: '1', aisle: 'Produce' }, { name: 'Fresh parsley', qty: '1 bunch', aisle: 'Spices & Herbs' }], step: 'Dress with lemon juice, olive oil and chopped parsley.' },
      { id: 'garlic-butter', name: 'Garlic butter', emoji: '🧄', time: 3, vegetarian: true, ingredients: [{ name: 'Butter', qty: '40 g', aisle: 'Dairy & Eggs' }, { name: 'Garlic', qty: '3 cloves', aisle: 'Produce' }], step: 'Melt butter with crushed garlic and spoon over the dish.' },
    ],
  },
];

export type BuildSelection = {
  protein?: string;
  base?: string;
  veg: string[];
  sauce?: string;
};

const find = (key: ComponentGroup['key'], id?: string) =>
  BUILD_GROUPS.find((g) => g.key === key)!.options.find((o) => o.id === id);

export function composeMeal(sel: BuildSelection): Meal | null {
  const protein = find('protein', sel.protein);
  const base = find('base', sel.base);
  const sauce = find('sauce', sel.sauce);
  if (!protein || !base) return null;
  const veg = sel.veg.map((v) => find('veg', v)).filter(Boolean) as MealComponent[];
  const parts = [protein, base, ...veg, ...(sauce ? [sauce] : [])];

  // merge duplicate ingredients (e.g. garlic from two components)
  const merged = new Map<string, Ingredient>();
  for (const p of parts)
    for (const ing of p.ingredients) {
      const existing = merged.get(ing.name);
      merged.set(ing.name, existing ? { ...existing, qty: `${existing.qty} + ${ing.qty}` } : ing);
    }

  const name = `${sauce ? sauce.name + ' ' : ''}${protein.name} with ${base.name}`;
  const vegetarian = parts.every((p) => p.vegetarian);
  return {
    id: `custom-${[sel.protein, sel.base, ...[...sel.veg].sort(), sel.sauce ?? 'plain'].join('-')}`,
    name,
    emoji: protein.emoji,
    description: [protein.name, base.name, ...veg.map((v) => v.name)].join(' · ') + (sauce ? ` · ${sauce.name} sauce` : ''),
    time: Math.max(...parts.map((p) => p.time)) + 5,
    serves: 2,
    categories: ['Quick & Easy', ...(vegetarian ? ['Vegetarian'] : []), 'Healthy'],
    ingredients: [...merged.values()],
    steps: [
      ...parts.filter((p) => p !== sauce).map((p) => p.step),
      ...(sauce ? [sauce.step] : []),
      'Plate up the base, pile on the protein and vegetables, and enjoy!',
    ],
    custom: true,
  };
}
