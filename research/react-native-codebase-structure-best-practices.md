# React Native Codebase Structure: Industry Best Practices (2025-2026)

**Research Date:** January 14, 2026
**Purpose:** Document industry best practices for structuring React Native codebases with Expo, focusing on maintainability, scalability, and ease of extension.

---

## Executive Summary

Modern React Native applications benefit from well-organized folder structures that prioritize **feature-based organization**, **clear separation of concerns**, and **modular architecture**. The industry has converged on several key patterns:

1. **Feature-based structure** over technical layer separation for scalability
2. **TypeScript-first** approach for type safety and maintainability
3. **Monorepo architecture** when managing multiple apps with shared code
4. **Comprehensive testing strategy** with Jest, Detox, and/or Maestro
5. **Expo as the standard** build and deployment tool

---

## 1. Project Structure Fundamentals

### 1.1 The Five-Step Evolution

According to Robin Wieruch's widely-adopted methodology, React folder structures should evolve as projects grow:

**Step 1: Single File** → **Step 2: Multiple Files** → **Step 3: Component Folders** → **Step 4: Technical Folders** → **Step 5: Feature-Based Organization**

For production applications, most teams should start at Step 4 or 5.

**Key Principle:** "Avoid nesting more than two levels" to maintain simplicity and navigability.

### 1.2 Core Architecture Patterns

Modern React Native apps follow a **three-layer architecture**:

1. **UI/Presentation Layer** - Components and screens users interact with
2. **Logic Layer** - Business logic, state management, and event handling
3. **API Layer** - Backend communication and data persistence

---

## 2. Recommended Folder Structure

### 2.1 Standard Structure (Single App)

```
project-root/
├── app/                      # Expo Router - Routes, layouts, navigation
├── src/
│   ├── api/                  # API calls, data fetching, server communication
│   │   ├── client.ts         # Base API client configuration
│   │   ├── [feature].api.ts  # Feature-specific API modules
│   │   └── index.ts          # Barrel exports
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # Core themed components (buttons, inputs, modals)
│   │   └── [feature]/        # Feature-specific components
│   ├── features/             # Feature modules (business logic + UI)
│   │   └── [feature-name]/
│   │       ├── components/   # Feature-specific components
│   │       ├── hooks/        # Feature-specific hooks
│   │       ├── screens/      # Feature screens
│   │       ├── services/     # Feature business logic
│   │       ├── types/        # Feature TypeScript types
│   │       └── index.ts      # Public API
│   ├── screens/              # Application screens/pages
│   ├── navigation/           # Navigation configuration, stack/tab navigators
│   ├── hooks/                # Shared custom React hooks
│   ├── services/             # Shared utilities and business logic
│   ├── store/                # State management (Redux/Zustand/Context)
│   │   ├── slices/           # Feature slices (Redux Toolkit)
│   │   ├── actions/          # Redux actions by feature
│   │   ├── reducers/         # Redux reducers by feature
│   │   └── index.ts          # Store configuration
│   ├── lib/                  # Core utilities (auth, storage, i18n)
│   ├── constants/            # App constants, configuration
│   ├── types/                # Global TypeScript types and interfaces
│   ├── utils/                # Helper functions, formatters
│   └── theme/                # Design tokens, colors, typography
├── assets/                   # Static assets (images, fonts, icons)
├── translations/             # i18n resource files (JSON)
├── __tests__/               # Tests (if using centralized approach)
├── .env                      # Environment variables
├── app.json                  # Expo configuration
├── package.json
├── tsconfig.json             # TypeScript configuration
├── metro.config.js           # Metro bundler configuration
└── babel.config.js           # Babel configuration
```

### 2.2 Monorepo Structure (Multiple Apps)

For projects with multiple apps (e.g., customer app, driver app, admin panel):

```
monorepo-root/
├── apps/
│   ├── customer-app/         # Customer mobile app
│   ├── driver-app/           # Driver mobile app
│   └── admin-web/            # Admin web interface (optional)
├── packages/                 # Shared packages
│   ├── shared-components/    # Reusable UI components
│   ├── shared-utils/         # Common utilities
│   ├── shared-types/         # Shared TypeScript types
│   ├── api-client/           # Shared API client
│   └── theme/                # Shared design system
├── package.json              # Root workspace configuration
└── tsconfig.base.json        # Base TypeScript config
```

**Tools:** Yarn Workspaces, npm Workspaces, or Nx for monorepo management.

**Expo Support:** Since SDK 52, Expo automatically configures Metro for monorepos. Metro has supported symlinks since version 0.75.1 (React Native 0.72).

---

## 3. Component Organization

### 3.1 Atomic Design Pattern

Organize UI components using Atomic Design principles:

- **Atoms**: Smallest low-level native wrappers (custom buttons, inputs, text)
- **Molecules**: Combinations of atoms (login form, search bar)
- **Organisms**: Complete screens built from molecules and atoms

**Example:**
```
components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.ts
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── Input/
├── molecules/
│   ├── LoginForm/
│   └── SearchBar/
└── organisms/
    └── Header/
```

### 3.2 Component Folder Structure

Each component should have its own folder containing:

- `Component.tsx` - Implementation
- `Component.styles.ts` - Styles (StyleSheet or styled-components)
- `Component.test.tsx` - Tests
- `index.ts` - Barrel export for clean imports

### 3.3 Container/Component Pattern

Separate logic from presentation:

- **Containers** (`container.tsx`) - Manage state and business logic
- **Components** (`view.tsx`) - Focus solely on rendering UI

This separation enables better testability and reusability.

---

## 4. Feature-Based Organization

### 4.1 Why Feature-Based?

Feature-based organization "brings features together which allows teams to work on specific features without touching files across the project."

**Benefits:**
- Clear ownership and boundaries
- Parallel team development
- Easier code reviews
- Reduced merge conflicts
- Better encapsulation

### 4.2 Feature Module Structure

```
features/
└── authentication/
    ├── components/          # Auth-specific components
    │   ├── LoginButton.tsx
    │   └── SocialLogin.tsx
    ├── hooks/               # Auth-specific hooks
    │   └── useAuth.ts
    ├── screens/             # Auth screens
    │   ├── LoginScreen.tsx
    │   └── RegisterScreen.tsx
    ├── services/            # Auth business logic
    │   ├── authService.ts
    │   └── tokenManager.ts
    ├── store/               # Auth state management
    │   └── authSlice.ts
    ├── types/               # Auth types
    │   └── auth.types.ts
    └── index.ts             # Public API exports
```

---

## 5. State Management

### 5.1 Popular Solutions (2025)

1. **Redux Toolkit** - Enterprise standard, comprehensive ecosystem
2. **Zustand** - Lightweight, modern, minimal boilerplate
3. **React Query / TanStack Query** - Server state management
4. **Context API** - Simple global state for smaller apps

### 5.2 State Organization

```
store/
├── index.ts                 # Store configuration
├── slices/                  # Redux Toolkit slices
│   ├── authSlice.ts
│   ├── cartSlice.ts
│   └── userSlice.ts
├── middleware/              # Custom middleware
└── types.ts                 # Store types
```

**Best Practice:** Organize state by feature, not by technical concern. Each feature owns its slice.

---

## 6. API and Services Layer

### 6.1 API Organization

```
api/
├── client.ts                # Base API client (Axios/Fetch)
├── interceptors.ts          # Request/response interceptors
├── auth.api.ts              # Authentication endpoints
├── products.api.ts          # Product endpoints
├── orders.api.ts            # Order endpoints
└── index.ts                 # API exports
```

**Naming Convention:** `[feature].api.ts` clearly indicates backend interaction files.

### 6.2 Services Pattern

```
services/
├── storageService.ts        # AsyncStorage wrapper
├── navigationService.ts     # Navigation utilities
├── analyticsService.ts      # Analytics integration
└── notificationService.ts   # Push notifications
```

Services encapsulate cross-cutting concerns and external integrations.

---

## 7. TypeScript Best Practices

### 7.1 Configuration

**Benefits:** Professional development teams report **up to 40% fewer bugs** when using properly structured React Native projects with TypeScript.

### 7.2 Type Organization

```
types/
├── index.ts                 # Re-export all types
├── api.types.ts             # API request/response types
├── navigation.types.ts      # Navigation param types
├── models/                  # Domain models
│   ├── User.ts
│   ├── Product.ts
│   └── Order.ts
└── common.types.ts          # Shared utility types
```

### 7.3 Path Aliases

Configure absolute imports for cleaner code:

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],
      "@services/*": ["src/services/*"],
      "@api/*": ["src/api/*"]
    }
  }
}
```

**babel.config.js:**
```javascript
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@features': './src/features',
        },
      },
    ],
  ],
};
```

**Usage:**
```typescript
// Instead of: import { Button } from '../../../components/atoms/Button'
import { Button } from '@components/atoms/Button';
```

---

## 8. Testing Strategy

### 8.1 Testing Pyramid

```
        /\
       /E2E\          Maestro/Detox (Few)
      /------\
     /  Integ \       React Testing Library (Some)
    /----------\
   /    Unit    \     Jest (Many)
  /--------------\
```

### 8.2 Testing Tools

**Unit Testing: Jest**
- Standard for React Native unit tests
- Fast execution
- Built-in mocking capabilities

**Integration Testing: React Native Testing Library**
- Component testing
- User-centric test approach
- Works seamlessly with Jest

**E2E Testing: Maestro (Recommended) or Detox**

**Maestro:**
- Minimal setup required
- YAML-based test definitions
- Cloud testing support (EAS)
- Expo's official recommendation (SDK 2.1.0+)
- "Makes testing fun — locally and in CI"

**Detox:**
- JavaScript-based tests
- Built by Wix engineering team
- Automatically synchronized with app operations
- Cross-platform (iOS & Android)
- Works with Expo non-development builds

### 8.3 Test Organization

**Option 1: Co-located Tests**
```
components/
└── Button/
    ├── Button.tsx
    ├── Button.test.tsx
    └── index.ts
```

**Option 2: Centralized Tests**
```
__tests__/
├── unit/
├── integration/
└── e2e/
```

**Recommendation:** Use co-located tests for component/unit tests, centralized structure for E2E tests.

---

## 9. File Naming Conventions

### 9.1 Naming Standards

- **Components:** PascalCase - `LoginButton.tsx`
- **Utilities:** camelCase - `formatDate.ts`
- **Constants:** UPPER_SNAKE_CASE - `API_ENDPOINTS.ts`
- **Types:** PascalCase - `User.types.ts`
- **Tests:** Match source - `LoginButton.test.tsx`
- **Styles:** Match source - `LoginButton.styles.ts`

### 9.2 File Extensions

- `.tsx` - React components with JSX
- `.ts` - TypeScript without JSX
- `.test.tsx` / `.test.ts` - Test files
- `.styles.ts` - Style definitions

---

## 10. Navigation Structure

### 10.1 Navigation Organization

```
navigation/
├── index.tsx                # Root navigator
├── types.ts                 # Navigation types
├── stacks/
│   ├── AuthStack.tsx        # Authentication flow
│   ├── MainStack.tsx        # Main app flow
│   └── OnboardingStack.tsx  # Onboarding flow
├── tabs/
│   └── MainTabs.tsx         # Bottom tab navigator
└── linking.ts               # Deep linking configuration
```

### 10.2 Type-Safe Navigation

```typescript
// navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

// Usage
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
```

---

## 11. Environment and Configuration

### 11.1 Environment Variables

```
.env                         # Default environment
.env.development             # Development overrides
.env.staging                 # Staging environment
.env.production              # Production environment
```

Use `react-native-config` or `expo-constants` for environment management.

### 11.2 Configuration Files

```
constants/
├── config.ts                # App configuration
├── apiEndpoints.ts          # API endpoints
├── colors.ts                # Color palette
├── typography.ts            # Font definitions
└── dimensions.ts            # Spacing, sizing constants
```

---

## 12. Performance Considerations

### 12.1 Code Organization for Performance

- **Lazy loading:** Use React.lazy() for route-based code splitting
- **Memoization:** Leverage React.memo, useMemo, useCallback
- **Image optimization:** Use expo-image or react-native-fast-image
- **List virtualization:** FlatList for long lists with proper optimization

### 12.2 Bundle Size Management

- Avoid unnecessary dependencies
- Use modular imports (e.g., `lodash/get` vs `lodash`)
- Analyze bundle with `npx react-native-bundle-visualizer`
- Implement code splitting for large features

---

## 13. Build and Deployment

### 13.1 Expo Build System (EAS)

Expo Application Services (EAS) provides:
- Cloud builds for iOS and Android
- Over-the-air (OTA) updates
- Automated E2E testing with Maestro
- CI/CD integration

### 13.2 Build Profiles

**eas.json:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

---

## 14. Enterprise Patterns

### 14.1 Modularization

Break large apps into independent modules:

- **Feature modules:** Self-contained features
- **Core modules:** Shared infrastructure
- **UI modules:** Design system components

### 14.2 Architectural Patterns

**Model-View-ViewModel (MVVM):**
- `view.tsx` - UI presentation
- `container.tsx` - View logic
- `model.ts` - Data and business logic

**Benefits:**
- Clear separation of concerns
- Improved testability
- Reusable business logic

---

## 15. Documentation and Code Quality

### 15.1 Documentation Structure

```
docs/
├── architecture.md          # Architecture decisions
├── setup.md                 # Setup instructions
├── conventions.md           # Coding conventions
├── api.md                   # API documentation
└── deployment.md            # Deployment guide
```

### 15.2 Code Quality Tools

- **ESLint:** JavaScript/TypeScript linting
- **Prettier:** Code formatting
- **Husky:** Git hooks
- **lint-staged:** Pre-commit linting
- **TypeScript:** Static type checking

---

## 16. Migration Path

### 16.1 Evolving Your Structure

Start simple, evolve as needed:

1. **Small projects:** Technical folders (Step 4)
2. **Growing projects:** Introduce feature modules gradually
3. **Large projects:** Full feature-based organization
4. **Multiple apps:** Monorepo architecture

### 16.2 Refactoring Guidelines

- Refactor incrementally, one feature at a time
- Maintain backward compatibility during transition
- Update documentation as you refactor
- Ensure tests pass after each refactor step

---

## 17. Anti-Patterns to Avoid

### 17.1 Common Mistakes

1. **Deep nesting:** Avoid more than 2-3 levels of folders
2. **God components:** Keep components focused and small
3. **Circular dependencies:** Use barrel exports carefully
4. **Mixed concerns:** Don't mix business logic with UI
5. **Premature abstraction:** Don't over-engineer early

### 17.2 Scalability Red Flags

- Components > 300 lines of code
- Files with multiple responsibilities
- Tight coupling between features
- No clear module boundaries
- Lack of TypeScript types

---

## 18. Real-World Examples and Templates

### 18.1 Production-Ready Boilerplates

- **Obytes Starter:** Comprehensive React Native/Expo starter with best practices
- **Expo MVVM Template:** MVVM architecture enforcement
- **React Native TypeScript Boilerplate:** Full-featured TypeScript setup
- **React Native Universal Monorepo:** Multi-platform support

### 18.2 Open Source References

Study production apps:
- Meta's internal React Native apps
- Expo documentation examples
- Community showcase apps on Expo

---

## 19. Checklist: Starting a New React Native Project

### Phase 1: Setup
- [ ] Initialize with Expo CLI
- [ ] Configure TypeScript
- [ ] Set up path aliases
- [ ] Configure ESLint and Prettier
- [ ] Set up Git hooks (Husky)

### Phase 2: Structure
- [ ] Create folder structure
- [ ] Set up navigation
- [ ] Configure state management
- [ ] Create API client
- [ ] Set up environment variables

### Phase 3: Development Tools
- [ ] Configure testing (Jest)
- [ ] Set up E2E testing (Maestro/Detox)
- [ ] Add error tracking (Sentry)
- [ ] Configure analytics
- [ ] Set up CI/CD pipeline

### Phase 4: Quality
- [ ] Write component tests
- [ ] Add integration tests
- [ ] Create E2E test suite
- [ ] Document architecture
- [ ] Review security practices

---

## 20. Key Takeaways

### Critical Principles

1. **Feature-based organization** scales better than technical layers
2. **TypeScript** is essential for maintainability
3. **Testing pyramid** ensures quality at every level
4. **Expo + EAS** simplifies build and deployment
5. **Modular architecture** enables team scalability

### Success Metrics

A well-structured React Native codebase achieves:
- **Fast onboarding:** New developers productive in days
- **Easy navigation:** Find any file in < 30 seconds
- **Low coupling:** Change features without breaking others
- **High testability:** Comprehensive test coverage
- **Scalable teams:** Multiple teams work in parallel

---

## References

- [React Folder Structure in 5 Steps [2025]](https://www.robinwieruch.de/react-folder-structure/)
- [25 React Native Best Practices for High Performance Apps 2026](https://www.esparkinfo.com/blog/react-native-best-practices)
- [How to organize Expo app folder structure for clarity and scalability](https://expo.dev/blog/expo-app-folder-structure-best-practices)
- [Scalable and Modular React Native Expo Folder Structure 2025](https://medium.com/@md.alishanali/scalable-and-modular-react-native-expo-folder-structure-2025-606abc0bf7d6)
- [React Native project structure: a best practices guide](https://www.tricentis.com/learn/react-native-project-structure)
- [Project Structure | React Native / Expo Starter](https://starter.obytes.com/getting-started/project-structure/)
- [Scaling React Native: Advanced Architecture Patterns for Enterprise Apps](https://medium.com/@ripenapps-technologies/scaling-react-native-advanced-architecture-patterns-for-enterprise-apps-1453649bc544)
- [Best Practices for Structuring a React Native TypeScript Project](https://blog.stackademic.com/best-practices-for-structuring-a-react-native-typescript-project-aff471741185)
- [Assessing the Top Tools and Best Practices for Testing Cross-Platform React Native Applications](https://nearform.com/insights/assessing-the-top-tools-and-best-practices-for-testing-cross-platform-react-native-applications/)
- [Run E2E tests on EAS Workflows and Maestro - Expo Documentation](https://docs.expo.dev/eas/workflows/examples/e2e-tests/)
- [Work with monorepos - Expo Documentation](https://docs.expo.dev/guides/monorepos/)
- [Setting up React Native Monorepo With Yarn Workspaces](https://www.callstack.com/blog/setting-up-react-native-monorepo-with-yarn-workspaces)

---

**Document Version:** 1.0
**Last Updated:** January 14, 2026
**Maintained by:** MilkRound Engineering Team
