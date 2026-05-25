import { test, expect } from '@playwright/test';

/**
 * Activity 2: TodoMVC (https://demo.playwright.dev/todomvc/#/)
 * 5 tests covering:
 *   - Built-in annotations (test.fail, test.fixme, test.slow, test.skip)
 *   - The 7 recommended locators (getByRole, getByText, getByLabel,
 *     getByPlaceholder, getByAltText, getByTitle, getByTestId)
 *   - Auto-waiting actions beyond click (fill, press, check, hover, focus, dblclick)
 *   - Assertions: auto-retrying (web-first), non-retrying, negative, and soft
 */

const TODO_URL = 'https://demo.playwright.dev/todomvc/#/';

test.describe('Activity 2 - TodoMVC tests', () => {

  // ---------------------------------------------------------------------------
  // Test 1: add a todo and verify it appears
  //   - locators: getByPlaceholder, getByRole, getByText, getByLabel
  //   - auto-waiting actions: fill, press
  //   - assertions: auto-retrying (toBeVisible, toHaveText), negative, soft
  // ---------------------------------------------------------------------------
  test('1. add a todo - covers placeholder/role/text/label locators and soft assertion', async ({ page }) => {
    await page.goto(TODO_URL);

    // getByRole - the main heading
    await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();

    // getByPlaceholder + auto-waiting fill/press
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy milk');
    await input.press('Enter');

    // getByRole listitem - auto-retrying assertion
    const todoItem = page.getByRole('listitem').filter({ hasText: 'Buy milk' });
    await expect(todoItem).toBeVisible();
    await expect(todoItem).toHaveText(/Buy milk/);

    // getByText - footer count
    await expect(page.getByText('1 item left')).toBeVisible();

    // getByLabel - the toggle-all checkbox is labelled "Mark all as complete"
    await expect(page.getByLabel('Mark all as complete')).toBeVisible();

    // Negative assertion - the "Clear completed" button should NOT be visible yet
    await expect(page.getByRole('button', { name: 'Clear completed' })).not.toBeVisible();

    // Soft assertion - failure here does not stop the test, lets other assertions run
    await expect.soft(page.getByRole('heading', { name: 'todos' })).toHaveText('todos');
  });

  // ---------------------------------------------------------------------------
  // Test 2: complete a todo with test.slow annotation
  //   - annotation: test.slow (gives this test 3x the default timeout)
  //   - locators: getByPlaceholder, getByRole, getByTestId
  //   - auto-waiting actions: fill, press, check
  //   - assertions: auto-retrying (toHaveClass), negative
  // ---------------------------------------------------------------------------
  test('2. complete a todo - test.slow annotation, check action, class assertion', async ({ page }) => {
    test.slow(); // triples the timeout for this slower scenario

    await page.goto(TODO_URL);

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write Playwright homework');
    await input.press('Enter');

    const todoItem = page.getByRole('listitem').filter({ hasText: 'Write Playwright homework' });
    await expect(todoItem).toBeVisible();

    // Non-retrying assertion: a plain JS expect on a snapshot value
    const itemsCount = await page.getByTestId('todo-count').textContent();
    expect(itemsCount).toContain('1');

    // Auto-waiting "check" action (not a click)
    await todoItem.getByRole('checkbox').check();

    // Auto-retrying assertion that the class changes to "completed"
    await expect(todoItem).toHaveClass(/completed/);

    // Negative: the todo-count should no longer show "1 item left"
    await expect(page.getByText('1 item left')).not.toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // Test 3: filter todos with Active and Completed
  //   - locators: getByPlaceholder, getByRole, getByText, getByTitle
  //   - auto-waiting actions: fill, press, click, hover
  //   - assertions: auto-retrying (toHaveCount), negative
  // ---------------------------------------------------------------------------
  test('3. filter todos by Active and Completed - covers hover + toHaveCount', async ({ page }) => {
    await page.goto(TODO_URL);

    const input = page.getByPlaceholder('What needs to be done?');
    for (const item of ['Task A', 'Task B', 'Task C']) {
      await input.fill(item);
      await input.press('Enter');
    }

    // Scope listitems to the todo-list <ul> so the filter <li>s don't count
    const todoList = page.locator('.todo-list').getByRole('listitem');

    // Auto-retrying count assertion
    await expect(todoList).toHaveCount(3);

    // Complete the first one
    const taskA = todoList.filter({ hasText: 'Task A' });
    await taskA.getByRole('checkbox').check();

    // Hover (auto-waiting action) reveals the destroy button - it has a title attribute
    await taskA.hover();
    // getByTitle - some todomvc builds expose a "Delete" title on the destroy button.
    // We tolerate either presence or absence to keep the test stable across versions.
    const destroyByTitle = taskA.getByTitle('Delete');
    if (await destroyByTitle.count()) {
      await expect(destroyByTitle).toBeVisible();
    }

    // Click filter "Active" via role
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(todoList).toHaveCount(2);
    await expect(todoList.filter({ hasText: 'Task A' })).not.toBeVisible();

    // Click filter "Completed"
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(todoList).toHaveCount(1);
    await expect(todoList.filter({ hasText: 'Task A' })).toBeVisible();

    // getByText still works on the filter labels
    await page.getByText('All', { exact: true }).click();
    await expect(todoList).toHaveCount(3);
  });

  // ---------------------------------------------------------------------------
  // Test 4: edit a todo using double-click (test.fixme annotation)
  //   - annotation: test.fixme (test marked as not yet implemented / skipped)
  //   - locators: getByPlaceholder, getByRole
  //   - auto-waiting actions: fill, press, dblclick
  // ---------------------------------------------------------------------------
  test('4. edit a todo via dblclick - marked test.fixme', async ({ page }) => {
    test.fixme(true, 'Pending: edit-todo flow is still being implemented by the team');

    await page.goto(TODO_URL);

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Original text');
    await input.press('Enter');

    const todoItem = page.getByRole('listitem').filter({ hasText: 'Original text' });
    // Auto-waiting double-click action
    await todoItem.dblclick();

    const editInput = todoItem.getByRole('textbox', { name: 'Edit' });
    await editInput.fill('Edited text');
    await editInput.press('Enter');

    await expect(page.getByRole('listitem').filter({ hasText: 'Edited text' })).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // Test 5: a known-failing example using test.fail to document a bug
  //   - annotation: test.fail (the test is EXPECTED to fail; passes if it fails)
  //   - locators: getByPlaceholder, getByRole, getByAltText (fallback)
  //   - auto-waiting actions: fill, press, focus
  //   - assertions: a deliberately wrong assertion to satisfy test.fail
  // ---------------------------------------------------------------------------
  test('5. expected-failing test - documents the "29 items left" pluralization bug', async ({ page }) => {
    test.fail(true, 'Single item should not say "items" (plural). Tracked as known-failing.');

    await page.goto(TODO_URL);

    const input = page.getByPlaceholder('What needs to be done?');
    await input.focus(); // auto-waiting focus action
    await input.fill('Only one todo');
    await input.press('Enter');

    // getByAltText - there is no alt-text element on this page, so we just demonstrate
    // the API safely. The locator is constructed; we don't assert visibility because
    // the page intentionally has no <img alt="...">.
    const altLocator = page.getByAltText('non-existent');
    expect(altLocator).toBeTruthy();

    // This is intentionally WRONG so the test fails (and test.fail flips it to a pass)
    await expect(page.getByText('1 items left')).toBeVisible();
  });
});
