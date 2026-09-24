export type Aisle =
  | 'Produce'
  | 'Meat & Seafood'
  | 'Dairy & Eggs'
  | 'Bakery'
  | 'Pantry'
  | 'Spices & Herbs'
  | 'Frozen'
  | 'Other';

export interface Ingredient {
  name: string;
  qty: string;
  aisle: Aisle;
}

export interface Meal {
  id: string;
  name: string;
  emoji: string;
  description: string;
  time: number; // minutes
  serves: number;
  categories: string[];
  traditional?: boolean;
  origin?: string;
  ingredients: Ingredient[];
  steps: string[];
  custom?: boolean; // created with Build a Meal
}

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
export type Day = (typeof DAYS)[number];

export const SLOTS = ['Breakfast', 'Lunch', 'Dinner'] as const;
export type Slot = (typeof SLOTS)[number];

export interface PlanEntry {
  id: string;
  mealId: string;
  day: Day;
  slot: Slot;
  includeRecipe: boolean;
  /** ingredient name -> user confirmed they have it */
  have: Record<string, boolean>;
  /** true once the user has opened / reviewed the ingredient check */
  checked: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  qty: string;
  aisle: Aisle;
  bought: boolean;
  entryId?: string;
  mealName?: string;
  day?: Day;
}

export type SideView = 'planner' | 'recipes' | 'restaurants' | 'delivery' | 'shopping';
export type TopTab = 'favourites' | 'traditional' | 'build' | 'categories';
