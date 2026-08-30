# Fumestory — engineering plan

Living doc. Update as priorities change. Prefer short items here; link out for long designs.

## Now

### Olfactory notes — curated vs other
- Model in place: `notes.kind` (`curated` | `other`), DB colors for inventory dots; academy/encyclopedia still use local `NOTE_DOT_STYLES`
- Agent resolve-notes + text-to-gradient API exist
- [ ] Color picker: suggest gradient via `/api/agent/text-to-gradient`
- [ ] CI: TS ↔ seed sync for curated categories (`CURATED_CATEGORY_NAMES` vs 017) and notes (`NOTE_DOT_STYLES` vs 020); check only, do not write DB
- Curated sync: TS maps are source of truth → regen seed SQL on edit → apply to Neon manually; CI only verifies match
- Later (optional): `user_settings.note_colors` overrides — resolve `override ?? notes.color` (do not mutate curated rows)

### Pay-as-you-go (online + offline)
Commercial model: **no subscription**. Free caps + €10 capacity packs. Online Stripe + redeem + emails shipped. Offline: redeem works; buy via browser.

**Shipping leftovers**
- [ ] Finish offline shipping — Windows installer (CI seed sqlite); Mac zip/update channel as needed
- [ ] Offline curated catalog polish if still needed for v1

**Current offline buy UX**
- Hide **Buy Pack** in packaged offline; **View Pricing Packs** opens `https://fumestory.com/pricing`; redeem in-app

**Defer**
- Cross-app entitlement sync (same email)
- Pack stacking UI, restore magic link, agent token packs
- **Offline in-app Stripe Checkout** — Buy Pack via Tauri `openUrl` to Stripe fails (opener allowlist / long checkout URLs). Keep browser pricing for now; revisit later (short bounce, allowlist, or stay browser-only)
- **Offline paid-tier enforcement (privacy-preserving)** — v1 trusts local SQLite (`extras_*` editable by a tech user). Later:
  - Under free caps: fully offline, no phone-home
  - On **insert only**, if local count would exceed free caps: require online check (or valid signed entitlement) using email + install id
  - Source of truth for paid extras = **server** (or signed payload), not local `extras_*` (local cache for UI only)
  - Do **not** upload inventory/formulas — only “am I allowed this insert?”
  - If offline and already at free cap: block insert with “go online to use paid capacity”
  - Optional: signed entitlement blob from redeem/refresh for short offline paid use

## Next

### Formula UI rounding (derived field only)
- [ ] Weight mode: round derived `%` (near-int snap + max 2 dp; e.g. 2.999→3, 2.998→2.99)
- [ ] Percent mode: round derived weight to 4 dp (`0.0001g`)
- [ ] Do not round the field currently being edited
- Files: `useFormulaIngredients.tsx` (+ optional `formulaRounding.ts`)

### Persist per-mod formula table sort
- [ ] Save AgGrid sort state per composition + formula (mod) id
- [ ] Restore on grid ready; default = Formula % desc when unset
- [ ] Prefer localStorage (device-local); consider user_settings later if cross-device needed
- File: `_dashboard.composition.$compositionId.tsx`

### Compositions list — status tabs
- [ ] Add status on `compositions`: `wip` | `finished` | `archived` (default `wip`)
  - Note: DB already has `active` | `archived` (024); align naming or extend
- [ ] Tabs on `/compositions`: WIP | Finished | Archived
- [ ] Actions: move between statuses (e.g. Mark finished, Archive, Restore to WIP)
- [ ] API: filter by status; PATCH to update status
- New compositions start as WIP

### Composition detail — mod status tabs
- [ ] Add status on `formulas`: `active` | `discarded` (default `active`)
- [ ] Tabs on `/composition/:id`: Active | Discarded
- [ ] Actions: Discard / Restore to Active
- [ ] API: filter mods by status; PATCH status
- Naming: Discarded for mods (not Archived) — avoids clash with composition Archived

### Per-composition “best” mod
- [ ] Mark exactly one active formula as best per composition
  - Prefer `formulas.is_best` (unique among active for that composition) or `compositions.best_formula_id`
- [ ] UI: hollow star next to mod title; click → filled + label/tooltip “Best”
- [ ] Clicking another active mod’s star moves Best to that one
- [ ] Discarding the best mod clears Best (or block discard until reassigned)
- [ ] Best only allowed on `active` mods (not discarded)

### Collapsible mod overview (persisted)
- [ ] Overview panel (pyramid + family pie ± comment) collapsible under each mod
- [ ] Ingredients grid stays outside that panel
- [ ] Persist open/closed per composition + formula id (localStorage)
- [ ] Default: expanded

### Curated raw materials — search modal (then maybe autocomplete)
- On add raw material: magnifying-glass button next to name opens curated search dialog
- Selecting a result is one curated pick: fills name + CAS (and related defaults) together
- Editing name or CAS after clears the curated link (custom / unlinked) — no dual name/CAS curated matching
- Manual typing stays valid without using Search
- Three clear entry modes for UX/onboarding: Manual | Search (curated) | Materials agent
- Later: optional inline autocomplete on top of the same single-pick model

## Later / ideas

### Olfactory family — optional follow-ups
- Optional curated sub picker when family has subs (e.g. balsamic / resinous)
- Later subs: Spices cool/warm, Earthy mossy

### Formula % bar scale (settings option)
- [ ] User setting: bar fill mode on composition formula grid
  - `absolute` — full track = 100% of formula (default)
  - `relative` — full track = highest % in that mod
- [ ] Wire into `/composition/:id` Formula % cell renderer
- [ ] Add control in project/user settings UI (same pattern as column toggles)
- File: `user-settings.ts` + `_dashboard.composition.$compositionId.tsx`

### Codex Security CLI (optional)
- [ ] Trial local scan: `npx @openai/codex-security scan .`
- [ ] Review findings (auth, API routes, RLS, env)
- Later: CI advisory job with `OPENAI_API_KEY` (advisory-only first)

## Related docs

- [Inventory agent](./inventory-agent.md)