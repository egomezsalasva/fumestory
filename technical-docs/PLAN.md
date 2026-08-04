# Fumestory — engineering plan

Living doc. Update as priorities change. Prefer short items here; link out for long designs.

## Now

### Olfactory notes — curated vs other
- Same `notes` table: `kind` (`curated` | `other`), `owner_id`, `color` (CSS: `#hex` or `linear-gradient(...)`)
- Curated: seed from `NOTE_DOT_STYLES`; encyclopedia/academy keep reading that client map
- Inventory: note dots from DB `notes.color` (not `NOTE_DOT_STYLES` at runtime)
- Materials `other`: color required when creating (picker / agent gradient); feedback `other`: color stays optional (`null`)
- Autocomplete: curated first; freeform → `other` (exact match only in the picker; no musky→musk there)
- Agent apply (`/api/agent/resolve-notes`): LLM normalize + catalog match (musky→musk; lightly floral stays); new notes colored via `textToCssGradient`
- Shared tool: `textToCssGradient` + `POST /api/agent/text-to-gradient` (wire into add-material color picker next)
- Agent category: `suggestedCategory` constrained to `CURATED_CATEGORY_NAMES` (TS); apply matches curated parents exact-only
- Keep one FK for feedback / raw_material notes joins
- [x] DB: schema (019), seed (020), rempoint + partial uniques (021), RLS (022)
- [x] Inventory/raw-materials: return note `color` from DB; dots use DB
- [x] Notes API: list curated (+ own other with color); create `other` on material/feedback submit; `set_config`
- [x] Agent: resolve-notes + text-to-gradient; curated category enum + prompt; apply waits for resolve + loading UI
- [x] Encyclopedia/academy: local `NOTE_DOT_STYLES` for speed
- [ ] Color picker: suggest gradient via `/api/agent/text-to-gradient`
- [ ] CI: TS ↔ seed sync for curated categories (`CURATED_CATEGORY_NAMES` vs 017) and notes (`NOTE_DOT_STYLES` vs 020); check only, do not write DB
- Curated sync: TS maps are source of truth → regen seed SQL on edit → apply to Neon manually; CI only verifies match
- Later (optional): `user_settings.note_colors` overrides — resolve `override ?? notes.color` (do not mutate curated rows)

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

## Done

### Olfactory family — curated + other (016–018)
- Model: `categories.kind` / `parent_id` / `owner_id`; colors via client defaults + `user_settings.category_colors`
- Seed: 18 curated families; subs under resinous / balsamic
- API: curated parents list; create `other` only; `set_config` + RLS (018)
- UI: inventory/composition family tint + pie rollup; add-material select curated or Other (name + color)

## Related docs

- [Inventory agent](./inventory-agent.md)