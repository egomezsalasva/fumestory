# Fumestory — engineering plan

Living doc. Update as priorities change. Prefer short items here; link out for long designs.

## Now

### Composition note pyramid (overview)
- [ ] Aggregate High / Mid(Heart) / Base % per mod (`note_type` already on formula lines)
- [ ] Per-mod overview pyramid on `/composition/:id` (alongside family pie + notes)
- [ ] Show % text inside each band (always opaque / high-contrast)
- [ ] Band fill opacity = (pct / 100) * 0.8 (0% → 0, 100% → 0.8)
- Open: unknown note types? equal vs taller base bands?
- Reuse / extend: `NotePyramidIcon` (per-row indicator already ships)
- Follow-up:
  - [ ] Extract a reusable compact pyramid (or shared totals helper)
  - [ ] Compact pyramid column on mods table

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

### Mods table — pyramid column
Depends on: Composition note pyramid (overview)
- [ ] Compact cell renderer (mini bands / fill) using same High / Mid / Base totals
- [ ] Wire into mods table column defs
- Confirm which table: composition-detail mods overview vs `/compositions` list (latest mod)

### Per-mod notes
- [ ] Add nullable `mod_notes` (or `formula_notes`) on `formulas`
- [ ] Expose + update via composition/formula APIs
- [ ] Show editable notes under each mod on `/composition/:id`
- Optional: set notes when creating a formula on add-formula
- UI label: "Notes" — freeform mod notes, not material olfactory notes

### Per-mod family pie + notes
- [ ] Aggregate formula % by category per mod (`category_name` already on formula lines)
- [ ] Layout under each mod: pie (left) + editable notes (right)
- [ ] Add nullable `mod_notes` (or `formula_notes`) on `formulas`; API read/write
- UI label: "Notes" — freeform mod notes, not material olfactory notes

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
- [ ] Overview panel (pyramid + family pie + notes) collapsible under each mod
- [ ] Ingredients grid stays outside that panel
- [ ] Persist open/closed per composition + formula id (localStorage)
- [ ] Default: expanded

## Later / ideas

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

## Done (recent)

- Academy rename (routes, settings key `academy_enabled`, migration 014)
- Formula diff on add-formula (vs baseline / prefill)
- Formula % bar on composition grid
- Number input: no value change on scroll-wheel

## Related docs

- [Inventory agent](./inventory-agent.md)