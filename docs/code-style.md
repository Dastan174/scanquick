# Coding Style Guide

## General Rules

The project uses:

- TypeScript
- ESLint
- Prettier

Never manually format code.

# TypeScript

Avoid: any
Prefer:unknown
or proper types.

# Components

One component = one responsibility.
Bad:
Dashboard.tsx
containing:
API calls
forms
validation
tables
modals

Split:

Dashboard/
├── Dashboard.tsx
├── dashboard.api.ts
├── DashboardTable.tsx
Imports

Order:

React
External libraries
Internal aliases
Relative imports

Example:
import React from "react"
import axios from "axios"
import {Button} from "@/shared/ui"
import styles from "./styles"

# Comments

Do not comment obvious code.
