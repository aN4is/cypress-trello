# Cypress Trello Test Automation

Comprehensive test automation suite for a Trello clone application with advanced Cypress testing practices.

## Overview

This test suite demonstrates professional E2E testing practices including:

- **Smoke Tests**: Critical path validation
- **Regression Tests**: Full feature coverage
- **Authentication Tests**: Login and signup flows
- **Visual Regression**: Screenshot-based testing with Applitools
- **Accessibility Tests**: WCAG compliance with cypress-axe
- **API Tests**: Backend endpoint validation
- **Reporting**: Enhanced test reports with Mochawesome

## Test Structure

```
cypress/
├── e2e/
│   ├── smoke/              # Critical path tests
│   ├── regression/         # Full regression suite
│   ├── auth/              # Authentication flows
│   └── accessibility/     # A11y tests
├── fixtures/              # Test data
├── support/
│   ├── commands.ts        # Custom commands
│   ├── e2e.ts            # Global config
│   └── page-objects/     # Page object models
└── reports/              # Mochawesome reports
```

## Running Tests

### Local Testing

```bash
# Install dependencies
npm install

# Open Cypress Test Runner
npm run cy:open

# Run all tests headlessly
npm run cy:run

# Run specific test suite
npx cypress run --spec "cypress/e2e/smoke/**/*.cy.ts"

# Run with specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
```

### Docker Testing

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run specific services
docker-compose up trello-app
docker-compose run cypress

# Clean up
docker-compose down -v

# Manual Docker commands
docker build -t trello-app .
docker run -d -p 3000:3000 --name trello-app trello-app
```

### Parallel Execution

```bash
# Run tests in parallel (requires Cypress Dashboard or CI)
npx cypress run --record --parallel --ci-build-id $BUILD_ID
```

## Application Under Test

Bundled as a submodule is a clone of the popular [Trello app](https://trello.com).
Developed by Filip Hric.

**Features**:

- Create boards, lists and cards
- Drag and drop cards between lists
- Upload pictures to card details
- User signup and login
- Private boards per user

### Installation

```bash
# Install dependencies
npm install

# Start application
npm start

# Access at
http://localhost:3000
```

### Database

The application uses a JSON file for persistence:

- Database: `trelloapp/backend/data/database.json`
- Uploads: `trelloapp/backend/data/uploaded`

### Application Utilities

Press `F2` in the application to access development utilities:

- Reset application state
- Delete boards, lists, cards, users
- Useful for manual testing and debugging

## Test Reporting

### Mochawesome Reports

Test results are generated with Mochawesome after each run:

```bash
# Run tests with reporting
npm run cy:run

# View report
open cypress/reports/index.html
```

**Report includes**:

- Test execution summary
- Pass/fail statistics
- Screenshots on failure
- Execution duration
- Test categorization by suite

### Applitools Visual Testing

Visual regression tests use Applitools Eyes:

```bash
# Set Applitools API key
export APPLITOOLS_API_KEY=your_key_here

# Run visual tests
npx cypress run --spec "cypress/e2e/visual/**/*.cy.ts"
```

## Dependencies

### Core Testing

- `cypress` - E2E test framework
- `typescript` - Type safety
- `@cypress/webpack-preprocessor` - TypeScript support

### Enhancements

- `mochawesome` - Test reporting
- `cypress-axe` - Accessibility testing
- `@applitools/eyes-cypress` - Visual regression
- `cypress-file-upload` - File upload support

### Installation

```bash
# All dependencies
npm install

# Production dependencies only
npm install --production
```

## Best Practices

1. **Use page objects** for maintainable test code
2. **Validate API responses** before UI testing
3. **Reset state** before each test using API calls
4. **Use custom commands** for common operations
5. **Tag tests** appropriately (smoke, regression, etc.)
6. **Run accessibility tests** on key user flows
7. **Capture screenshots** on test failures

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Cypress tests
  uses: cypress-io/github-action@v5
  with:
    start: npm start
    wait-on: 'http://localhost:3000'
    browser: chrome
    spec: cypress/e2e/**/*.cy.ts

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: cypress-reports
    path: cypress/reports/
```

## Troubleshooting

### Tests timing out

Increase timeout in `cypress.config.ts`:

```typescript
defaultCommandTimeout: 10000,
requestTimeout: 10000,
```

### Application not starting

Check if port 3000 is available:

```bash
lsof -i :3000
kill -9 <PID>
```

### Visual tests failing

Update baselines in Applitools dashboard or locally:

```bash
npx eyes-storybook --update-baseline
```

## API Documentation

### Boards

**`GET`** `/api/boards`

Returns all boards

**Example response (unauthorized user):**

```json
[
  {
    "name": "new project",
    "user": 0,
    "id": 27315982008,
    "starred": false,
    "created": "2020-09-01"
  },
  {
    "name": "moon landing 2",
    "user": 0,
    "id": 14254049205,
    "starred": true,
    "created": "2020-09-01"
  }
]
```

**Example response (authorized user):**

```json
[
  {
    "name": "new project",
    "user": 0,
    "id": 27315982008,
    "starred": false,
    "created": "2020-09-01"
  },
  {
    "name": "moon landing 2",
    "user": 0,
    "id": 14254049205,
    "starred": true,
    "created": "2020-09-01"
  },
  {
    "name": "private board",
    "user": 1, // user id of the board author
    "id": 6606529940,
    "starred": false,
    "created": "2020-09-01"
  }
]
```

**`POST`** `/api/boards`

Creates a new board

**Example request:**

```json
{
  "name": "moon landing 2"
}
```

**Example response:**

```json
{
  "name": "moon landing 2",
  "user": 1,
  "id": 22559285486,
  "starred": false,
  "created": "2020-09-01"
}
```

**`GET`** `/api/boards/{boardId}`

Returns details of a board with given `boardId`

**Example response:**

```json
{
  "name": "new project",
  "user": 0,
  "id": 27315982008,
  "starred": false,
  "created": "2020-09-01"
}
```

**`PATCH`** `/api/boards/{boardId}`

Changes details of a board with given `boardId`. `starred` and `name` attributes can be changed

**Example request:**

```json
{
  "starred": true,
  "name": "project alpha"
}
```

**`DELETE`** `/api/boards/{boardId}`

Deletes a board with given `boardId`

### Lists

**`GET`** `/api/lists`

Returns all lists

**Example response:**

```json
[
  {
    "boardId": 123456789,
    "name": "Groceries",
    "order": 0,
    "id": 68040017610,
    "created": "2022-01-26"
  },
  {
    "boardId": 987654321,
    "name": "Drugstore",
    "order": 1,
    "id": 87979775072,
    "created": "2022-02-11"
  }
]
```

**`GET`** `/api/lists?boardId={boardId}`

Returns all lists with given `boardId`

**`POST`** `/api/lists`

Creates a new list

**Example request:**

```json
{
  "boardId": {boardId}, // required
  "name": "to do"
}

```

**`PATCH`** `/api/lists/{listId}`

Changes details of a list with given `listId`

**Example request:**

```json
{
  "name": "renamed list"
}
```

**`DELETE`** `/api/lists/{listId}`

Deletes a list with given `listId`

### Cards

**`POST`** `/api/cards`

Creates a new card

**Example request:**

```json
{
  "boardId": {boardId}, // required
  "listId": {listId}, // required
  "name": "buy milk"
}

```

**`PATCH`** `/api/cards/{cardId}`

Changes details of a card `cardId`

**Example request:**

```json
{
  "completed": true
}
```

**`DELETE`** `/api/cards/{cardId}`

Deletes a card `cardId`

### Users & Authentication

**`GET`** `/api/users`

Returns information for the current user

**Example response:**

```json
{
  "user": {
    "email": "filip@example.com",
    "password": "$2a$10$fdK.5O8uogdfjgklôjgd/gf90890NKLJ",
    "id": 1
  }
}
```

**`POST`** `/api/signup`

Creates a new user

**Example request:**

```json
{
  "email": "filip@example.com",
  "password": "nbusr1234"
}
```

**`POST`** `/api/welcomeemail`

Sends a request for a welcome email

**Example request:**

```json
{
  "email": "filip@example.com"
}
```

**`POST`** `/api/login`

Logs in a user

**Example request:**

```json
{
  "email": "filip@example.com",
  "password": "nbusr1234"
}
```

### Database State Management

Special endpoints for handling database state during testing

**`POST`** `/api/reset`

Deletes all boards, lists, cards and users

**`DELETE`** `/api/boards`

Deletes all boards, lists and cards

**`DELETE`** `/api/lists`

Deletes all lists and cards

**`DELETE`** `/api/cards`

Deletes all cards

**`DELETE`** `/api/users`

Deletes all users
