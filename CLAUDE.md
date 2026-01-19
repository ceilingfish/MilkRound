# Project Structure

* Specifications go in the `specs` folder
* OpenAPI specs go in the `specs/Apis` folder
* If you do any research on a topic, it should go into the `research` folder
* Code will go in the `src` folder
* Scripts will go in the `scripts` folder
* Terraform should go in the `infrastructure` folder

# Style guidelines

Use markdown for writing any documentation.

If you are designing an API you should tend towards CQRS patterns. You should categorise API actions into one of the following:
* Commands - These change state. If it isn't a GET verb, it's very likely a command
* Queries - These fetch data from a data store and present it.

API paths should always use PascalCase for all segments (e.g., `/Auth/Signup`, `/Supplier/{id}/DeliverySchedule`).

# Tech choices

## Backend 

The backend should be written in C# 10. It should make use of the latest language features, including:

* OpenAPI automatic generation of an API spec
* All default namespaces should be `MilkRound` followed by the assembly name.
* It should make use of "hexagonal architecture" and ports and adapters.

The solution file (and all these assemblies) should be in the `src` folder. The solution file should be `MilkRound.sln` and contain the following projects:
* Application - This should contain the business logic that ties ports to their respective adapters. It should contain a series of command & query handlers. One for each query and command. There should be a models folder inside here that contains the command and query model objects, and another folder that contains the handlers.
* Abstractions - This is a library that should contain the interfaces implemented in Adapters, and used in Application
* DataContracts - This should contain the domain entities that are used by the Client and the API controllers
* Api.Service - This is the entry point executable that should run the asp.net core API. The docker file should be in this project, and the ASP.Net Controllers. The controllers should call command and query handler interfaces defined in the Application library. It should use the domain objects from the DataContracts library
* Api.Client - This should contain a strongly type .net client that is auto-generated from the OpenAPI spec. It should generate this using the Refit library
* Adapters - These are the abstractions that bridge between the business logic in Application and the underlying implementation. e.g. cosmos DB. If you need to create a library for this please use the assembly name `Data.XXX` where XXX is a representative name of an abstraction.
* Data.PostgresSQL - This should be a sqlproj file that contains all of the tables, stored procedures and indices. It should also contain a database client that implements an interface for data access defined in Abstractions

## Abstractions

### Data Reader & Writer

The interface for persistence should separate out writers (which should be used to persist data written by commands) and readers which should be used to read data requested by queries

### Tests

Tests should all go at the same level. All libraries should have a `.UnitTests` project, that contains unit tests for the abstractions in the matching project. We do not need to unit test _everything_, it's more important to have coverage of logic paths that overall code coverage

There should also be a `Service.ComponentTests` library that runs the entry point in memory with mocks for all the adapters. This should test that the API surface responds as expected.

We should also have `Service.FunctionalTests`. This library should "black box" test the library using an API address that is read from configuration. The tests in here should make use of the API client, and the assertions should be that the command makes the data changes that are expected

## Frontend

We want to use React Native for the front end. It should be based on a modern version and make use of expo.

The mobile application will live in `src/MobileUi` and support both customer and supplier roles through role-based navigation.

### Project Structure

The React Native application should follow this structure:

```
src/
└── MobileUi/                 # React Native Expo app
    ├── app/                  # Expo Router (file-based routing)
    ├── src/
    │   ├── api/              # API client and endpoint definitions
    │   ├── components/
    │   │   ├── ui/           # Atoms (buttons, inputs, basic UI)
    │   │   └── [feature]/    # Feature-specific components
    │   ├── features/         # Feature modules
    │   │   ├── shared/       # Shared features for both roles
    │   │   ├── customer/     # Customer-specific features
    │   │   └── supplier/     # Supplier-specific features
    │   ├── screens/          # Screen components
    │   ├── navigation/       # Navigation configuration
    │   ├── hooks/            # Custom React hooks
    │   ├── services/         # Business logic and utilities
    │   ├── store/            # Zustand state management
    │   ├── types/            # TypeScript type definitions
    │   ├── utils/            # Helper functions
    │   └── theme/            # Design tokens, colors, typography
    ├── assets/               # Images, fonts, icons
    ├── app.json              # Expo configuration
    ├── package.json
    ├── tsconfig.json
    └── metro.config.js
```

Each feature module should be self-contained:

```
features/
└── [feature-name]/
    ├── components/           # Feature-specific components
    ├── hooks/                # Feature-specific hooks
    ├── screens/              # Feature screens
    ├── services/             # Feature business logic
    ├── types/                # Feature TypeScript types
    └── index.ts              # Public API exports
```

### Architecture Principles

**Feature-Based Organization:**
- Organize code by business feature, not technical layer
- Each feature module is self-contained with its own components, hooks, services, and types
- Shared/reusable code goes in `components/ui/` or the appropriate shared folder
- This enables parallel team development and clear ownership boundaries

**Component Organization (Atomic Design):**
- **Atoms:** Basic UI components (Button, Input, Text)
- **Molecules:** Combinations of atoms (LoginForm, SearchBar)
- **Organisms:** Complete screens/sections built from molecules and atoms

**Separation of Concerns:**
- `view.tsx`: UI presentation only
- `container.tsx`: Logic and state management
- `styles.ts`: Styling separate from components
- This pattern improves testability and reusability

### TypeScript Configuration

All React Native code must use TypeScript:

- Enable TypeScript strict mode for maximum type safety
- Configure path aliases for clean imports:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"],
        "@components/*": ["src/components/*"],
        "@features/*": ["src/features/*"],
        "@api/*": ["src/api/*"]
      }
    }
  }
  ```
- Define types in `types/` folders (global and feature-specific)
- Type all navigation params using React Navigation's type system
- Use PascalCase for type names with `.types.ts` suffix (e.g., `User.types.ts`)

### State Management

Use **Zustand** for state management. It's lightweight, has minimal boilerplate, and is sufficient for this application's complexity.

**Structure:**
```
store/
├── index.ts              # Export all stores
├── useAuthStore.ts       # Authentication state
├── useOrderStore.ts      # Order management state
├── useUserStore.ts       # User profile state
└── useCartStore.ts       # Shopping cart state
```

**Principles:**
- Each domain gets its own store (no god-state objects)
- Keep stores focused and single-purpose
- Use selectors for derived state
- Persist critical state (auth tokens) using zustand/middleware

### Component Organization

Follow the Atomic Design pattern:

**Atoms** (`components/ui/`)
- Smallest UI building blocks
- Examples: Button, Input, Text, Icon
- Highly reusable with minimal logic

**Molecules** (`components/` or feature-specific)
- Combinations of atoms into functional units
- Examples: LoginForm, SearchBar, ProductCard
- Contain form logic and validation

**Organisms** (`screens/` or `features/*/screens/`)
- Complete screens or major page sections
- Built from molecules and atoms
- Contain business logic and state

Each component should have its own folder:
```
Button/
├── Button.tsx
├── Button.styles.ts
├── Button.test.tsx
└── index.ts
```

### API Integration

The frontend communicates with the C# backend API:

- Reference the OpenAPI specs in `specs/Apis/` for API contracts
- Create a TypeScript API client in `src/api/`
- Organize API calls by feature: `auth.api.ts`, `orders.api.ts`, `products.api.ts`
- Use React Query (TanStack Query) for server state management
- Handle authentication tokens and refresh logic in the API client

**API Client Structure:**
```
api/
├── client.ts             # Base API client configuration (Axios/Fetch)
├── interceptors.ts       # Request/response interceptors
├── auth.api.ts           # Authentication endpoints
├── orders.api.ts         # Order endpoints
├── products.api.ts       # Product endpoints
└── index.ts              # API exports
```

### Testing Requirements

Follow a comprehensive testing strategy aligned with the backend testing philosophy:

**Testing Pyramid:**
1. **Unit Tests (Jest):** Test components, hooks, and utilities
2. **Integration Tests (React Native Testing Library):** Test feature workflows
3. **E2E Tests (Maestro):** Test critical user journeys

**Test Organization:**
- Co-locate component tests: `Button/Button.test.tsx`
- Centralize E2E tests: `__tests__/e2e/`
- Aim for logic path coverage over 100% line coverage
- Focus on testing behavior, not implementation details

**E2E Testing with Maestro:**
Maestro is Expo's recommended E2E testing tool. It uses YAML-based test definitions and supports cloud testing with EAS.

### Naming Conventions

Consistent naming improves code readability:

- **Components:** PascalCase (`LoginButton.tsx`)
- **Utilities:** camelCase (`formatDate.ts`)
- **Constants:** UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types:** PascalCase with `.types.ts` suffix (`User.types.ts`)
- **Styles:** Match source with `.styles.ts` suffix (`Button.styles.ts`)
- **Tests:** Match source with `.test.tsx` suffix (`Button.test.tsx`)
- **Folders:** kebab-case or camelCase for folders

### Monorepo Architecture

This repository uses a **monorepo approach** with both frontend and backend:

```
d:\Code\MilkRound/
├── src/
│   ├── MobileUi/            # React Native Expo app
│   ├── MilkRound.sln        # Backend solution
│   ├── Application/         # Backend business logic
│   ├── Api.Service/         # Backend API
│   └── ...                  # Other backend projects
├── specs/                   # API specifications
├── research/                # Research documentation
└── infrastructure/          # Terraform
```

**Benefits:**
- Single source of truth for all code
- Shared API contracts (OpenAPI specs)
- Unified version control and CI/CD
- Frontend can reference backend contracts directly

### Role-Based Architecture

The mobile app supports both customer and supplier roles in a single application:

**Role Management:**
- Store user role in Zustand auth store
- Use role-based navigation guards
- Conditionally render role-specific screens and features

**Navigation Structure:**
```
navigation/
├── AuthStack.tsx         # Login, register (no role required)
├── CustomerStack.tsx     # Customer-specific screens
├── SupplierStack.tsx       # Supplier-specific screens
└── RootNavigator.tsx     # Routes based on authenticated user's role
```

**Feature Organization by Role:**
- Shared features: `features/shared/`
- Customer features: `features/customer/`
- Supplier features: `features/supplier/`

### Build and Deployment

It should be possible to build the front end with a single command, using expo.

**Development:**
```bash
cd src/MobileUi
npx expo start
```

**Building:**
```bash
cd src/MobileUi

# Development build
eas build --profile development --platform ios

# Production build for both platforms
eas build --profile production --platform all
```

**Deployment:**
- Use EAS (Expo Application Services) for cloud builds
- Configure build profiles in `eas.json`
- Use EAS Update for over-the-air updates without app store submissions

**Monorepo Build Considerations:**
- Mobile app references OpenAPI specs from `specs/Apis/`
- CI/CD should detect frontend changes and run mobile-specific tests
- Coordinate API deployments before mobile app updates to ensure compatibility

### Code Quality Standards

Enforce code quality through tooling:

- **ESLint:** Enforce coding standards and catch errors
- **Prettier:** Consistent code formatting across the codebase
- **Husky + lint-staged:** Pre-commit hooks to run linting and formatting
- **TypeScript:** Strict mode enabled for maximum type safety
- **Folder Structure:** No nesting beyond 2 levels to keep structure flat and navigable

**Additional Best Practices:**
- Avoid deep nesting of folders (maximum 2-3 levels)
- Keep components under 300 lines of code
- Extract reusable logic into custom hooks
- Use absolute imports with path aliases
- Document complex business logic with comments

### Further Reading

For detailed research and expanded best practices, see [research/react-native-codebase-structure-best-practices.md](research/react-native-codebase-structure-best-practices.md).

## Infrastructure

This should be in the `infrastructure` folder, as discrete terraform modules. The structure should look like

```
infrastructure/
├── components/
|   ├── [component name]/
├── envs/
    ├── *.tfvars
```

All of this should be managed by a terragrunt hcl file in the root of the repository. We should lean towards opentofu

# Hard Rules

Below are some hard rules that you should always follow:

* If you don't understand an instruction, ask for clarification
* If the instruction comes from a specification, update the spec, when the user has answered you

