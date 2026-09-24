import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { StoreProvider } from '../store';
import { ToastProvider } from '../components/Toast';

function setup() {
  const user = userEvent.setup();
  render(
    <StoreProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </StoreProvider>,
  );
  return user;
}

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '';
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
});
afterEach(cleanup);

describe('CHOW', () => {
  it('shows the side menu and horizontal menu', () => {
    setup();
    for (const label of ['Recipes', 'Restaurants', 'Delivery Services', 'Shopping List'])
      expect(screen.getByRole('button', { name: new RegExp(label) })).toBeTruthy();
    for (const tab of ['Favourites', 'Traditional', 'Build a Meal', 'Categories'])
      expect(screen.getByRole('tab', { name: tab })).toBeTruthy();
    for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
      expect(screen.getByText(day)).toBeTruthy();
  });

  it('collapses the side menu', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Collapse menu' }));
    expect(document.querySelector('.sidebar')!.classList.contains('collapsed')).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Expand menu' }));
    expect(document.querySelector('.sidebar')!.classList.contains('collapsed')).toBe(false);
  });

  it('adds a Traditional meal with recipe to Wednesday, checks ingredients and builds the shopping list', async () => {
    const user = setup();
    await user.click(screen.getByRole('tab', { name: 'Traditional' }));
    await user.click(screen.getByRole('button', { name: 'Add Spaghetti Carbonara to planner' }));

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /Wednesday/ }));
    await user.click(within(dialog).getByRole('button', { name: 'Dinner' }));
    const recipeBox = within(dialog).getByRole('checkbox');
    expect((recipeBox as HTMLInputElement).checked).toBe(false);
    await user.click(within(dialog).getByText('Get the recipe too')); // opt in
    expect((recipeBox as HTMLInputElement).checked).toBe(true);
    await user.click(within(dialog).getByRole('button', { name: /Add & check ingredients/ }));

    // Entry modal opens
    const entry = screen.getByRole('dialog');
    expect(within(entry).getByText('Wednesday · Dinner')).toBeTruthy();
    // mark two ingredients as owned
    await user.click(within(entry).getByText('Spaghetti'));
    await user.click(within(entry).getByText('Eggs'));
    // add one ingredient individually
    const pancettaRow = within(entry).getByText('Pancetta').closest('li')!;
    await user.click(within(pancettaRow as HTMLElement).getByRole('button', { name: /Add to list/ }));
    // add the rest
    await user.click(within(entry).getByRole('button', { name: /Add 2 missing to list/ }));
    // recipe tab shows method
    await user.click(within(entry).getByRole('tab', { name: /Recipe/ }));
    expect(within(entry).getByText('Method')).toBeTruthy();
    await user.click(within(entry).getByRole('button', { name: 'Close' }));

    // planner chip reflects status
    expect(screen.getByText('3 on list')).toBeTruthy();

    // Shopping list has the 3 missing items
    await user.click(screen.getByRole('button', { name: /Shopping List/ }));
    expect(screen.getByText(/3 to buy/)).toBeTruthy();
    expect(screen.getByText('Pancetta')).toBeTruthy();
    expect(screen.getByText('Pecorino')).toBeTruthy();
    expect(screen.queryByText('Spaghetti')).toBeNull();

    // Recipe saved to recipe book
    await user.click(screen.getByRole('button', { name: /^Recipes/ }));
    expect(screen.getAllByText('Spaghetti Carbonara').length).toBeGreaterThan(0);
    expect(screen.getByText('Wed')).toBeTruthy();
  });

  it('uses the + button on a day slot to preselect day and slot, recipe off by default', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Add breakfast for Friday' }));
    expect(screen.getByText(/Choosing/)).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Add Fluffy Pancakes to planner' }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Add to Friday' }));
    expect(screen.getByText('Fluffy Pancakes', { selector: '.entry-name' })).toBeTruthy();
    expect(document.querySelector('.recipe-flag')).toBeNull();
  });

  it('builds a custom meal and adds it', async () => {
    const user = setup();
    await user.click(screen.getByRole('tab', { name: 'Build a Meal' }));
    await user.click(screen.getByRole('button', { name: /Salmon/ }));
    await user.click(screen.getByRole('button', { name: /Rice/ }));
    await user.click(screen.getByRole('button', { name: /Broccoli/ }));
    await user.click(screen.getByRole('button', { name: /Teriyaki/ }));
    expect(screen.getByText('Teriyaki Salmon with Rice')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Add to planner/ }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^Add to/ }));
    expect(screen.getByText('Teriyaki Salmon with Rice', { selector: '.entry-name' })).toBeTruthy();
  });

  it('renders restaurants and delivery services', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /Restaurants/ }));
    expect(screen.getByText('Sakura House')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Delivery Services/ }));
    expect(screen.getByText('Uber Eats')).toBeTruthy();
  });
});
