import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { DEFAULT_FAVOURITES, MEALS } from './data/meals';
import type { Day, Ingredient, Meal, PlanEntry, ShoppingItem, Slot, Aisle } from './types';

export interface State {
  favourites: string[];
  customMeals: Meal[];
  savedRecipes: string[];
  plan: PlanEntry[];
  shopping: ShoppingItem[];
}

type Action =
  | { type: 'TOGGLE_FAV'; mealId: string; meal?: Meal }
  | { type: 'ADD_ENTRY'; id?: string; meal: Meal; day: Day; slot: Slot; includeRecipe: boolean }
  | { type: 'REMOVE_ENTRY'; id: string }
  | { type: 'MOVE_ENTRY'; id: string; day: Day; slot: Slot }
  | { type: 'SET_INCLUDE_RECIPE'; id: string; value: boolean }
  | { type: 'SET_HAVE'; entryId: string; name: string; value: boolean }
  | { type: 'SET_ALL_HAVE'; entryId: string; names: string[]; value: boolean }
  | { type: 'MARK_CHECKED'; entryId: string }
  | { type: 'ADD_TO_LIST'; entryId: string; ingredients: Ingredient[] }
  | { type: 'REMOVE_FROM_LIST'; entryId: string; name: string }
  | { type: 'ADD_CUSTOM_ITEM'; name: string; qty: string; aisle: Aisle }
  | { type: 'SET_BOUGHT'; ids: string[]; value: boolean }
  | { type: 'REMOVE_ITEMS'; ids: string[] }
  | { type: 'CLEAR_BOUGHT' }
  | { type: 'CLEAR_LIST' }
  | { type: 'CLEAR_WEEK' }
  | { type: 'TOGGLE_SAVED_RECIPE'; mealId: string; meal?: Meal }
  | { type: 'RESET' };

const STORAGE_KEY = 'chow:v1';

const initialState: State = {
  favourites: DEFAULT_FAVOURITES,
  customMeals: [],
  savedRecipes: [],
  plan: [],
  shopping: [],
};

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

function upsertCustom(list: Meal[], meal?: Meal) {
  if (!meal?.custom || list.some((m) => m.id === meal.id)) return list;
  return [...list, meal];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_FAV': {
      const has = state.favourites.includes(action.mealId);
      return {
        ...state,
        customMeals: upsertCustom(state.customMeals, action.meal),
        favourites: has
          ? state.favourites.filter((f) => f !== action.mealId)
          : [...state.favourites, action.mealId],
      };
    }
    case 'ADD_ENTRY': {
      const entry: PlanEntry = {
        id: action.id ?? uid(),
        mealId: action.meal.id,
        day: action.day,
        slot: action.slot,
        includeRecipe: action.includeRecipe,
        have: {},
        checked: false,
      };
      return {
        ...state,
        customMeals: upsertCustom(state.customMeals, action.meal),
        savedRecipes:
          action.includeRecipe && !state.savedRecipes.includes(action.meal.id)
            ? [...state.savedRecipes, action.meal.id]
            : state.savedRecipes,
        plan: [...state.plan, entry],
      };
    }
    case 'REMOVE_ENTRY':
      return {
        ...state,
        plan: state.plan.filter((e) => e.id !== action.id),
        // drop un-bought list items that only existed for this meal
        shopping: state.shopping.filter((s) => !(s.entryId === action.id && !s.bought)),
      };
    case 'MOVE_ENTRY':
      return {
        ...state,
        plan: state.plan.map((e) => (e.id === action.id ? { ...e, day: action.day, slot: action.slot } : e)),
        shopping: state.shopping.map((s) => (s.entryId === action.id ? { ...s, day: action.day } : s)),
      };
    case 'SET_INCLUDE_RECIPE': {
      const entry = state.plan.find((e) => e.id === action.id);
      return {
        ...state,
        savedRecipes:
          action.value && entry && !state.savedRecipes.includes(entry.mealId)
            ? [...state.savedRecipes, entry.mealId]
            : state.savedRecipes,
        plan: state.plan.map((e) => (e.id === action.id ? { ...e, includeRecipe: action.value } : e)),
      };
    }
    case 'SET_HAVE':
      return {
        ...state,
        plan: state.plan.map((e) =>
          e.id === action.entryId ? { ...e, checked: true, have: { ...e.have, [action.name]: action.value } } : e,
        ),
        // If they now have it, it no longer needs to be on the list
        shopping: action.value
          ? state.shopping.filter((s) => !(s.entryId === action.entryId && s.name === action.name && !s.bought))
          : state.shopping,
      };
    case 'SET_ALL_HAVE':
      return {
        ...state,
        plan: state.plan.map((e) =>
          e.id === action.entryId
            ? { ...e, checked: true, have: Object.fromEntries(action.names.map((n) => [n, action.value])) }
            : e,
        ),
        shopping: action.value
          ? state.shopping.filter((s) => !(s.entryId === action.entryId && !s.bought))
          : state.shopping,
      };
    case 'MARK_CHECKED':
      return {
        ...state,
        plan: state.plan.map((e) => (e.id === action.entryId ? { ...e, checked: true } : e)),
      };
    case 'ADD_TO_LIST': {
      const entry = state.plan.find((e) => e.id === action.entryId);
      if (!entry) return state;
      const meal = findMeal(entry.mealId, state.customMeals);
      const fresh = action.ingredients
        .filter((ing) => !state.shopping.some((s) => s.entryId === action.entryId && s.name === ing.name))
        .map<ShoppingItem>((ing) => ({
          id: uid(),
          name: ing.name,
          qty: ing.qty,
          aisle: ing.aisle,
          bought: false,
          entryId: action.entryId,
          mealName: meal?.name,
          day: entry.day,
        }));
      return {
        ...state,
        plan: state.plan.map((e) => (e.id === action.entryId ? { ...e, checked: true } : e)),
        shopping: [...state.shopping, ...fresh],
      };
    }
    case 'REMOVE_FROM_LIST':
      return {
        ...state,
        shopping: state.shopping.filter((s) => !(s.entryId === action.entryId && s.name === action.name)),
      };
    case 'ADD_CUSTOM_ITEM':
      return {
        ...state,
        shopping: [
          ...state.shopping,
          { id: uid(), name: action.name, qty: action.qty, aisle: action.aisle, bought: false },
        ],
      };
    case 'SET_BOUGHT':
      return {
        ...state,
        shopping: state.shopping.map((s) => (action.ids.includes(s.id) ? { ...s, bought: action.value } : s)),
      };
    case 'REMOVE_ITEMS':
      return { ...state, shopping: state.shopping.filter((s) => !action.ids.includes(s.id)) };
    case 'CLEAR_BOUGHT':
      return { ...state, shopping: state.shopping.filter((s) => !s.bought) };
    case 'CLEAR_LIST':
      return { ...state, shopping: [] };
    case 'CLEAR_WEEK':
      return { ...state, plan: [], shopping: state.shopping.filter((s) => !s.entryId) };
    case 'TOGGLE_SAVED_RECIPE': {
      const has = state.savedRecipes.includes(action.mealId);
      return {
        ...state,
        customMeals: upsertCustom(state.customMeals, action.meal),
        savedRecipes: has
          ? state.savedRecipes.filter((r) => r !== action.mealId)
          : [...state.savedRecipes, action.mealId],
      };
    }
    case 'RESET':
      return initialState;
  }
}

export function findMeal(id: string, customMeals: Meal[]): Meal | undefined {
  return MEALS.find((m) => m.id === id) ?? customMeals.find((m) => m.id === id);
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState, ...JSON.parse(raw) };
  } catch {
    /* ignore corrupt storage */
  }
  return initialState;
}

interface Ctx {
  state: State;
  dispatch: React.Dispatch<Action>;
  getMeal: (id: string) => Meal | undefined;
  allMeals: Meal[];
}

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      dispatch,
      getMeal: (id) => findMeal(id, state.customMeals),
      allMeals: [...MEALS, ...state.customMeals],
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

/** Ingredient coverage status for a planned meal. */
export function entryStatus(entry: PlanEntry, meal: Meal | undefined, shopping: ShoppingItem[]) {
  const ings = meal?.ingredients ?? [];
  let have = 0;
  let onList = 0;
  let bought = 0;
  let missing = 0;
  for (const ing of ings) {
    const item = shopping.find((s) => s.entryId === entry.id && s.name === ing.name);
    if (entry.have[ing.name]) have++;
    else if (item?.bought) bought++;
    else if (item) onList++;
    else missing++;
  }
  return { total: ings.length, have, onList, bought, missing, ready: ings.length > 0 && have + bought === ings.length };
}
