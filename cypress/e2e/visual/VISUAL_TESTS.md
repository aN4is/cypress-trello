# Visual Regression Testing with Applitools Eyes

This directory contains visual regression tests using Applitools Eyes for the Trello Clone application.

## Prerequisites

1. Sign up for a free Applitools account at https://applitools.com/users/register
2. Get your API key from https://eyes.applitools.com/app/admin/api-keys

## Setup

### Local Development

1. Set your Applitools API key as an environment variable:

```bash
# Windows
set APPLITOOLS_API_KEY=your_api_key_here

# macOS/Linux
export APPLITOOLS_API_KEY=your_api_key_here
```

2. Run the visual tests:

```bash
npm run cy:visual
```

### CI/CD Setup

Add the `APPLITOOLS_API_KEY` as a secret in your GitHub repository:

1. Go to your repository Settings
2. Navigate to Secrets and variables > Actions
3. Click "New repository secret"
4. Name: `APPLITOOLS_API_KEY`
5. Value: Your Applitools API key

## Test Structure

The visual tests are organized into three files:

- `01_board_visual.cy.ts` - Board-level visual tests
- `02_list_visual.cy.ts` - List-level visual tests
- `03_card_visual.cy.ts` - Card-level visual tests

## Test Coverage

### Board Visual Tests

- Empty home page
- Board creation modal
- Newly created board
- Starred board
- Multiple boards on home page
- Board with long title
- Board with special characters

### List Visual Tests

- Board with single list
- Board with multiple lists
- List creation form
- List with long title
- Many lists requiring scroll
- Empty list placeholder
- List with special characters

### Card Visual Tests

- List with single card
- List with multiple cards
- Card detail modal
- Card with long title
- Cards across multiple lists
- List with many cards requiring scroll
- Card with special characters
- Card creation form
- Completed card indicator

## Applitools Configuration

The configuration is in `applitools.config.js` at the project root:

- **Test Concurrency**: 5 parallel tests
- **Browsers**: Chrome, Firefox, Edge (desktop), Chrome (800x600), iPhone X
- **Batch Name**: Cypress Trello Visual Tests

## Viewing Results

After running tests, view results in the Applitools dashboard:
https://eyes.applitools.com/app/test-results/

## Best Practices

1. **Baseline Creation**: First run creates baseline images
2. **Subsequent Runs**: Compare against baseline and flag differences
3. **Review Changes**: Accept or reject visual changes in the dashboard
4. **Update Baselines**: Accept changes to update the baseline when intentional
