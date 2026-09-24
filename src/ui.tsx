import { createContext, useContext } from 'react';
import type { Day, Meal, SideView, Slot } from './types';

export interface Target {
  day: Day;
  slot: Slot;
}

export interface UI {
  openAddMeal: (meal: Meal) => void;
  openEntry: (entryId: string) => void;
  openRecipe: (meal: Meal) => void;
  target: Target | null;
  setTarget: (t: Target | null) => void;
  go: (view: SideView) => void;
}

export const UIContext = createContext<UI | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIContext');
  return ctx;
}
