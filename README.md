# CHOW 🍽️

A weekly meal-planning web app. Pick meals, add the recipe if you want it, check which ingredients you already have, and send the rest to your shopping list.

## Features

- **Collapsible side menu**: Recipes, Restaurants, Delivery Services, Shopping List (plus a Meal Planner home link). Your collapsed/expanded choice is remembered. On phones it becomes a slide-out drawer.
- **Horizontal meal menu**
  - **Favourites**: meals you've marked with ♥
  - **Traditional**: classic dishes from around the world
  - **Build a Meal**: combine a protein, base, vegetables and sauce into your own meal
  - **Categories**: Breakfast, Quick & Easy, Vegetarian, Seafood, Pasta, and more
- **Weekly Meal Planner (Monday–Sunday)** with Breakfast, Lunch and Dinner slots. Choose a meal from the menu, or tap **+** on a day's slot to fill that exact slot.
- **"Get the recipe too" checkbox** when adding a meal. Ticking it attaches the step-by-step method to the planned meal and saves it to **Recipes → My recipe book**.
- **Ingredient check**: open any planned meal and tick what you already have. Tap **Add to list** on a missing item, or **Add all missing**, to send it to the **Shopping List**. Each meal card in the planner shows whether you have everything, how many items are missing, or how many are on the list.
- **Shopping List**: grouped by aisle (the same ingredient needed for several meals is combined) or by meal. Tick items off, add your own extras, copy the list, and clear bought items.
- Everything is saved in your browser's `localStorage`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest + Testing Library flows
npm run build    # type-check + production build to dist/
```

Built with React 19, TypeScript and Vite. Icons come from lucide-react.

> Restaurant listings are sample data. Delivery service links go to each service's official website.
