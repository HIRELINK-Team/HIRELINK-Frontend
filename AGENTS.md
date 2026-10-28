# HIRELINK Frontend Agent Guide

## 1. Project Overview

HIRELINK is a job matching service connecting international students in Korea with employers.

Frontend environment:

- React
- TypeScript
- React Router
- react-i18next / i18next
- ESLint
- Prettier
- Git / GitHub
- Figma

UI targets:

- Student service: mobile web app
- Employer service: desktop web

All React components must use TypeScript and `.tsx`.

Before implementing or modifying code, read:

- `docs/FRONTEND_DESIGN.md`
- `docs/CONVENTIONS.md`

Follow those documents unless the current user request explicitly overrides them.

---

## 2. General Development Rules

- Use React with TypeScript.
- Avoid `any` unless there is a clear technical reason.
- Do not introduce unnecessary libraries.
- Reuse existing components, hooks, utilities, and types before creating new ones.
- Do not restructure existing folders without a clear reason.
- Do not duplicate existing UI or logic.
- Keep components focused on a single responsibility where practical.
- Page-level components must use the `Page` suffix.
- Run ESLint and build checks after implementation.
- Apply Prettier formatting before considering work complete.
- Do not merge or treat generated code as complete if it has not been checked.

---

## 3. Naming Convention

### React Components

Use PascalCase.

Examples:

- `JobCard.tsx`
- `ApplicantCard.tsx`
- `CountdownTimer.tsx`
- `EmployerDashboardPage.tsx`

Component name and file name must match.

### TypeScript Files

Use camelCase.

Examples:

- `jobs.ts`
- `applications.ts`
- `formatTime.ts`
- `useCountdown.ts`

### Folders

Use lowercase.

Examples:

- `components/`
- `pages/`
- `hooks/`
- `types/`
- `api/`
- `utils/`
- `constants/`
- `assets/`
- `locales/`

### Variables and Functions

Use camelCase.

Functions should normally begin with a verb.

Examples:

- `fetchJobs`
- `getRemainingTime`
- `calculateMatchRate`

Event handlers must use `handle + action`.

Examples:

- `handleClick`
- `handleSubmit`
- `handleApply`
- `handleCancel`
- `handleLanguageChange`

Boolean variables should clearly describe state.

Examples:

- `isLoading`
- `isOpen`
- `isSelected`
- `isExpired`
- `isDisabled`
- `hasApplied`

### Constants

Use UPPER_SNAKE_CASE.

Examples:

- `MAX_RECOMMENDED_JOBS`
- `MAX_ACTIVE_APPLICATIONS`
- `MAX_REVIEWING_APPLICANTS`
- `RESPONSE_TIME_LIMIT_HOURS`

---

## 4. TypeScript Rules

Shared data types belong in `src/types`.

Example structure:

src/types/
- user.ts
- job.ts
- application.ts

Use interfaces or type aliases to clearly describe application data.

Use union types for values with a defined set of states.

Example:

```ts
export type ApplicationStatus =
  | 'REVIEWING'
  | 'OFFER_WAITING'
  | 'HIRED'
  | 'REJECTED'
  | 'EMPLOYER_EXPIRED'
  | 'STUDENT_EXPIRED'
  | 'CANCELED';
  ```

Define types for component props.

When backend API specifications become available, align frontend request and response types with the backend API contract.

Do not invent backend field names or API response structures when the specification is unknown.
5. Component Rules
Prefer reusable components for UI used across multiple pages.

Examples:
- Button
- Modal
- CountdownTimer
- EmptyState
- LoadingSkeleton
Do not make a component excessively large if meaningful responsibilities can be separated.

Before creating a new component:
1. Search for an existing component that can be reused.
2. Check whether the UI is shared across multiple pages.
3. Create a new component only when it improves reuse or clarity.
6. API Rules

- Use Axios for HTTP communication.
- Keep the shared Axios configuration in `src/api/client.ts`.
- Keep feature-specific API functions under `src/api`.
- Do not write long Axios request logic directly inside Page components.
- Reuse the shared Axios client instead of creating separate Axios instances without a clear reason.
- Do not invent API endpoints, request fields, or response fields before the backend API specification is available.
- Use mock data until an API contract is available when necessary.
7. Import Convention
Use the following order:
1. External libraries
2. Components
3. Hooks / API / utilities
4. Types
5. Styles
Keep related imports together.

Use import type for type-only imports where appropriate.
8. Styling Rules

- Use Tailwind CSS as the primary styling solution.
- Figma is the visual source of truth.
- Prefer Tailwind utility classes for layout and styling.
- Reuse shared components instead of duplicating long sets of Tailwind classes.
- Avoid repeatedly hard-coding the same design values across pages.
- Use custom CSS only when Tailwind CSS is not practical for a specific animation or complex visual effect.
- Do not introduce another styling library without explicit user approval.
9. Figma Implementation Rules
When implementing a Figma frame:
1. Inspect the current repository before creating files.
2. Inspect existing shared components and layouts.
3. Reuse existing implementation whenever possible.
4. Treat Figma as the visual source of truth.
5. Determine whether repeated UI should become a shared component.
6. Keep page-specific UI inside the appropriate page or feature area.
7. Do not modify unrelated existing screens unless necessary.
8. Preserve the current project structure unless there is a clear improvement.
For employer screens, reuse the shared employer layout when available.

For student screens, reuse shared mobile navigation and layout when available.
10. Routing Rules
Use React Router.

Routes should clearly reflect the user role and page purpose.

Examples:
- /student/...
- /employer/...
When implementing a new Figma screen, connect it to the route specified in the task.

Do not create arbitrary routes when the intended route is unclear.
11. Internationalization Rules
Use react-i18next / i18next.

Avoid hard-coded fixed UI text once internationalization is introduced.

Use translation keys grouped by feature.

Examples:
- application.apply
- application.cancel
- job.wage
- job.workTime
- common.confirm
Structured values such as job types, industries, and Korean-language levels should use stable code values and be translated through i18n.

Proper nouns such as business names should normally remain in their original form.
12. Git Rules
Branch structure:
- main
- develop
- feature/...
- fix/...
- refactor/...
Do not work directly on main for normal feature development.

Commit prefixes:
- feat
- fix
- style
- refactor
- docs
- chore
Commit messages should be written in Korean.
13. AI-generated Code Rules
AI-generated code must follow the same standards as manually written code.

Always:
- use React + TypeScript
- follow the existing folder structure
- follow naming conventions
- avoid unnecessary any
- reuse existing components
- preserve existing functionality
- check ESLint
- check TypeScript/build errors
- apply Prettier
- explain significant architectural changes when making them
Never assume generated code is correct solely because it compiles.
14. Completion Checklist
Before finishing an implementation task:
- Confirm the requested UI or feature is implemented.
- Confirm existing reusable components were considered.
- Confirm TypeScript errors are resolved.
- Run ESLint.
- Run the build command.
- Check for unintended changes to unrelated files.
- Ensure the result follows Figma and docs/CONVENTIONS.md.