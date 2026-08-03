# Fumestory — engineering plan

Living doc. Update as priorities change. Prefer short items here; link out for long designs.

## Now

### Formula UI rounding (derived field only)
- [ ] Weight mode: round derived `%` (near-int snap + max 2 dp; e.g. 2.999→3, 2.998→2.99)
- [ ] Percent mode: round derived weight to 4 dp (`0.0001g`)
- [ ] Do not round the field currently being edited
- Files: `useFormulaIngredients.tsx` (+ optional `formulaRounding.ts`)

## Next

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

### Olfactory notes — curated vs other
- Extend `notes` (same table, not two):
  - `kind`: `curated` | `other`
  - `color`: required for curated, NULL for other
  - `owner_id`: NULL for curated; set for user-created other
- UI: pick from curated list (with color); freeform creates `other` (no color / neutral swatch)
- Per-user color overrides: JSONB on `user_settings` (e.g. `note_colors: { "<noteId>": "#aabbcc" }`)
  - Resolve: `override ?? notes.color` — do not mutate shared curated rows
- Keep one FK for feedback / raw_material notes joins
- Autocomplete curated first; if the user types a non-curated name, store as `other` (personal choice — do not auto-merge aliases like musky → musk)
- Curated list stays the maintainable shared vocabulary (colors, cleanup, dedupe)

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