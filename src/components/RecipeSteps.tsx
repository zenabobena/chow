import type { Meal } from '../types';

export default function RecipeSteps({ meal }: { meal: Meal }) {
  return (
    <div className="recipe">
      <div className="recipe-cols">
        <div>
          <h4>Ingredients</h4>
          <ul className="recipe-ings">
            {meal.ingredients.map((i) => (
              <li key={i.name}>
                <span className="qty">{i.qty}</span> {i.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Method</h4>
          <ol className="steps">
            {meal.steps.map((s, i) => (
              <li key={i}>
                <span className="step-num">{i + 1}</span>
                <p>{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
