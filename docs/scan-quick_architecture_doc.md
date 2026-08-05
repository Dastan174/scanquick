For medium SaaS-like product app I would recommend lightweight FSD hybrid architecture.
FSD + our own adjustments.

```
src/
│
├── app/                 # Next.js App Router
│   ├── layout.tsx
│   ├── providers.tsx
│   └── routes
│
│
├── widgets/             # large UI blocks
│   ├── Navbar/
│   ├── Sidebar/
│   ├── DashboardHeader/
│   └── PricingSection/
│
├── features/            # user actions
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── auth.api.ts
│   │   └── useAuth.ts
│   │
│   ├── payment/
│   ├── create-project/
│   ├── upload-file/
│   └── invite-member/
│
├── entities/            # business objects
│   ├── user/
│   ├── project/
│   ├── subscription/
│   └── organization/
│
├── shared/              # reusable everywhere
│   ├── ui/
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── Input/
│   │
│   ├── api/
│   ├── hooks/
│   ├── lib/
│   ├── config/
│   └── types/
│
├── services/
|    ├──upload.service.ts
|    ├──payment.service.ts
```

## Concepts

Layers, slices form a hierarchy like this:
![[Pasted image 20260801151148.png]]

### Layers

1. **App** — everything that makes the app run — routing, entrypoints, global styles, providers.
2. **Widgets** — large self-contained chunks of functionality or UI, usually delivering an entire use case.
3. **Features** — _reused_ implementations of entire product features, i.e. actions that bring business value to the user.
4. **Entities** — business entities that the project works with, like `user` or `product`.
5. **Shared** — reusable functionality, especially when it's detached from the specifics of the project/business, though not necessarily.

### Slices

Next up are slices, which partition the code by business domain. You're free to choose any names for them, and create as many as you wish. Slices make your codebase easier to navigate by keeping logically related modules close together.

### Component Rules

Components should:

- Have one responsibility.
- Avoid API calls directly.
- Receive data through props/hooks.

Bad:

```
tsx
function UserCard() {
  fetch('/api/user');
}
```
