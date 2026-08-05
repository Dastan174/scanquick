# Romantic Memory Platform (RMP)

The Romantic Memory Platform is a full-stack Next.js application designed to allow users to build, customize, and deploy personalized romantic memory web pages. Once published, the platform generates a unique QR code allowing targeted recipients to view the media content on mobile viewports.

The core application features an asynchronous split-pane page editor, adaptive media asset delivery, and optional access protection for deployment nodes.

---

## Technical Architecture

### Core Stack

- **Application Framework:** Next.js (App Router architecture)
- **Programming Language:** TypeScript 5.x (Strict compilation flags enabled)
- **User Interface Styling:** Tailwind CSS
- **State Optimization Engine:** Zustand (Handles global and local content builder states)
- **Form Lifecycle Management:** React Hook Form
- **Database Interface Layer:** Prisma ORM
- **Storage Infrastructure:** Object Storage abstraction layer compatible with Cloudflare R2 / AWS S3 / Cloudinary

### Directory Structure & Module Maps

├── /app # Next.js App Router root layout and routing nodes
│ ├── /page.tsx # Application public landing page and value metrics
│ ├── /auth/register # User registration and identity onboarding
│ ├── /dashboard # User control panel and project state console
│ │ └── /create # Metadata entry for initial project generation
│ ├── /editor/[id] # Interactive drag-and-drop page builder environment
│ ├── /view/[slug] # Public client delivery view optimized for mobile browsers
│ └── /profile # User profile configuration and account settings
├── /components # Shared UI components and layout templates
├── /lib # Server utility modules (Prisma instance, encryption keys)
└── /store # Zustand data-stores governing content block states

---

## Application Functional Specifications

### 1. Unified Project Builder (Split-Pane Engine)

The builder interface coordinates three functional zones optimized to minimize layout shifting during modification cycles:

- **Component Drawer (Left-Pane):** Elements library allowing sequential injection of custom data modules:
  - _Cover Layout:_ Media canvas with typographic animations.
  - _Static Gallery:_ Standard row configurations, touch sliders, or responsive asset configurations.
  - _Template Collages:_ Pre-rendered aspect-ratio bounded layouts using explicit layout mapping keys.
  - _Letter Node:_ Dynamic Rich Text editor providing selection constraints for modern typefaces and custom type-writer transitions.
  - _Multimedia Layers:_ Dedicated background sound controllers (Audio Engine) and inline video player wrappers with custom metadata anchors.
  - _Chronometer Block:_ Precise milestone trackers analyzing standard timestamp objects.
- **Live Preview Matrix (Center-Pane):** A viewport wrapper mirroring mobile layout boundaries to provide immediate visual feedback.
- **Property Control Inspector (Right-Pane):** Context-aware parameter controller modifying attributes of the active component selection.

### 2. Relational System Layout

Content customization choices are converted into structured structural configuration schemas and securely stored as JSON objects in the backend database. This keeps storage footprints low and eliminates constant schema migrations when adding new features or components to the platform.

### 3. Verification & Privacy Guardrails

Publishers can configure access restriction keys on deployment folders to restrict unauthorized cross-origin indexing, ensuring individual pages remain private to the targeted recipient.

---

## Future Engineering Roadmap

The following architecture features are planned for upcoming development cycles to enhance platform scalability and monetization capabilities:

### Phase 1: Core Monetization & Gating Infrastructure

- **Payment Gateway Interfacing:** Integration of international billing networks (e.g., Stripe, YooKassa) via standardized secure webhook listeners.
- **Premium Feature Tiering:** Implementation of runtime feature-flag middleware to restrict advanced canvas templates, extended audio/video file storage capacities, and high-resolution vector QR code downloads behind successful transaction ledgers.

### Phase 2: Enhanced Customization & Interactivity

- **Custom Domain Routing:** Implementation of wildcard DNS mapping to allow premium nodes to resolve via custom subdomains or user-owned domains.
- **Interactive Mini-Games:** Introduction of client-side puzzles and interactive memory components embedded within the custom page composition pipeline.

---

## Infrastructure Initialization & Deployment

### Local Configuration Requirements

Create a localized environment file mapping system credentials. Ensure actual secret variables are excluded from downstream git histories.

```bash
cp .env.example .env.local
```

### Dependency Installation & Database Synchronization

1. Establish standard dependency configurations inside the local workspace:
   ```bash
   npm install
   ```
2. Propagate structural object schemas into your localized database instances:
   ```bash
   npx prisma migrate dev
   ```
3. Initialize the development execution loop:
   ```bash
   npm run dev
   ```

---

## Engineering Standards & Pipeline Quality Guardrails

This project utilizes localized enforcement configurations to keep style execution profiles uniform across separate engineering workstations.

- **Syntactic Styling:** Fixed by local rules managed by `Prettier` rules.
- **Static Code Auditing:** Regulated via project parameters declared inside `eslint.config.js`.
- **Automated Stage Ingestion Hooks:** Local executions of `git commit` automatically invoke **Husky** modules linked with `lint-staged`. If structural code formatting, static validation rules, or strict commit message rules are violated, processing execution stops.

Refer to `docs/setup.md` to properly configure local VS Code workspace assets, and check `CONTRIBUTING.md` to review the validation specifications.
