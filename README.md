#  User/Admin Panel

## Setup
Demo login credentials: user:password

### Prerequisites

- **Python** ≥ 3.11 — [python.org](https://www.python.org/downloads/)
- **Node.js** ≥ 20 — [nodejs.org](https://nodejs.org/en/download/)
- **pnpm** — [pnpm.io](https://pnpm.io/installation)

### Installation (once)

```sh
./install.<sh|bat>
```

### Start (every time)

```sh
./start.<sh|bat>
```

## Package Management

Add packages via `pnpm` manually in `panel/frontend`, or use:

```sh
./add.<sh|bat> <pnpm add package-name>
```

## Conventions

### Backend

**Database**
- Tables: `PascalCase`, plural
- Columns: `camelCase`, singular
- Acronyms: `UPPERCASE` (e.g. `HWID`, `IP`)
- Datetime: Use `datetime_now` lambda
- Enums: For fixed value sets (e.g. `UserStatus`)

**Python**
- Naming: `snake_case` for functions/variables
- Formatting: Double space between functions/classes

### Frontend

Based on [this guide](https://gist.github.com/anichitiandreea/e1d466022d772ea22db56399a7af576b)

- `camelCase`: class/interface members, methods, parameters
- `PascalCase`: class and interface names
- Use `function` over `const`
- Always declare variable types and function return types

## Key Code Standard

- 62-char set: A–Z, a–z, 0–9 (case sensitive)
- Minimum 12 chars
- Stored in DB
- Generated using a cryptographically secure PRNG

---

## TODO

- [ ] Banner for banned/frozen users
- [ ] Fetch loader logs
  - [ ] Log tabs (server/loader)
  - [ ] Show PC data in profile
- [ ] Regular DB backups + recovery
- [ ] Sign-out bug: `sonner` fires twice
- [ ] Add [forum chat](https://github.com/jakobhoeg/shadcn-chat)
- [x] Restrict password editing to resets only
  - [ ] Add user action
  - [ ] FE/BE reset endpoints
- [x] Settings
  - [x] Theme: dark/light
  - [ ] Theme color palettes
  - [x] Language:
    - [x] Date formats per locale
    - [x] Custom date/currency formats
- [x] Translations
  - [x] English, Czech
  - [ ] German, French, Russian
- [ ] Use [autocomplete search](https://www.armand-salle.fr/post/autocomplete-select-shadcn-ui) in header
- [ ] Move config/creds/ports to `.env`
  - [ ] Add `.env` to `.gitignore`
- [ ] **Products** (Robis)
  - [x] Sidebar item
  - [ ] Backend:
    - [x] DB update
    - [ ] Endpoints
    - [ ] FE tests
  - Product fields:
    - title, description, image, price, roles, keys count
    - status, start/end date, build, discount info
- [x] i18n in schemas, table/form validation
  - [ ] Dynamic breadcrumbs
  - [x] Currency/date translations
- [ ] Profile picture support
  - [x] Backend
  - [ ] Frontend
- [ ] Responsive design (tables, buttons, etc.)
- [ ] Toast message inflection (e.g. `copy`)
- [ ] Toast translations
  - [ ] Server sends generic messages → translated in FE
- [ ] Warning on first form open (create)
- [ ] Suspension endpoints
- [ ] Update `requirements.txt`
- [ ] Use `tanstack` `useQuery` instead of `useEffect` in FetchProvider/api:
  - Missing: `isLoading`, caching, proper toggleFetch behavior

---

## DONE

- [x] Suspension: search dropdown instead of `userId` (Karlos)
- [x] **Permission System** (Robis)
  - [x] Backend:
    - [x] `permission_required` decorator
    - [x] Endpoint protection
  - [x] Frontend:
    - [x] PermissionProvider
    - [x] Component visibility by permissions
  - [x] User identity integration

---

## Questions

### Backend
- Split `models` into multiple files?
- Should `salt` be stored in DB?

### Frontend
- Prefer local loaders over global
- Switch from custom fetch to `axios`?
- Avoid excessive context usage
- Always check for existing libraries
- Minimize and batch state changes
