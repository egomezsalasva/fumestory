# Fumestory — engineering plan

Living doc. Update as priorities change. Prefer short items here; link out for long designs.

## Now

### Composition note pyramid
- [ ] Expose `note_type` on composition formula lines (API)
- [ ] Aggregate High / Mid(Heart) / Base % per formula
- [ ] Pyramid UI on `/composition/:id` (fill each band by %)
- Open: unknown note types? equal vs taller base bands?
- Follow-up (after pyramid ships):
  - [ ] Extract a reusable compact pyramid (or shared totals helper)
  - [ ] Add a pyramid column to the mods table so each mod shows Top/Mid/Base at a glance

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
Depends on: Composition note pyramid
- [ ] Compact cell renderer (mini bands / fill) using same High / Mid / Base totals
- [ ] Wire into mods table column defs
- Confirm which table: composition-detail mods overview vs `/compositions` list (latest mod)

### Formula table: main olfactory family column
- On composition formula lines: show each material’s primary category (Floral, Musky, Woody, …)
- Data: already on materials as `category_name` / `category_id` — expose on formula-line API if missing
- Distinct from pyramid `note_type` (High / Mid / Base)

### Per-mod notes
- [ ] Add nullable `mod_notes` (or `formula_notes`) on `formulas`
- [ ] Expose + update via composition/formula APIs
- [ ] Show editable notes under each mod on `/composition/:id`
- Optional: set notes when creating a formula on add-formula
- UI label: "Notes" — freeform mod notes, not material olfactory notes

### Per-mod family pie + notes
- [ ] Expose `category_name` on formula lines (if not already)
- [ ] Aggregate formula % by category per mod
- [ ] Layout under each mod: pie (left) + editable notes (right)
- [ ] Add nullable `mod_notes` (or `formula_notes`) on `formulas`; API read/write
- UI label: "Notes" — freeform mod notes, not material olfactory notes
- Shares category data with: Formula table olfactory family column

### Composition note pyramid
- [ ] Expose `note_type` on formula lines (API)
- [ ] Aggregate High / Mid(Heart) / Base % per mod
- [ ] Per-mod overview pyramid on `/composition/:id` (alongside family pie + notes)
- [ ] Show % text inside each band (always opaque / high-contrast)
- [ ] Band fill opacity = (pct / 100) * 0.8 (0% → 0, 100% → 0.8)
- Open: unknown note types? equal vs taller base bands?
- Follow-up: compact pyramid column on mods table

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

### Collapsible mods (persisted)
- [ ] Each mod section on `/composition/:id` is collapsible (header stays visible: title, star, maybe pyramid/pie peek or not)
- [ ] Persist open/closed per composition + formula (mod) id
- [ ] Prefer localStorage (device-local), same pattern as formula table sort
- [ ] Sensible default: expanded (or only latest expanded)

## Later / ideas

### Formula % bar scale (settings option)
- [ ] User setting: bar fill mode on composition formula grid
  - `absolute` — full track = 100% of formula (default)
  - `relative` — full track = highest % in that mod
- [ ] Wire into `/composition/:id` Formula % cell renderer
- [ ] Add control in project/user settings UI (same pattern as column toggles)
- File: `user-settings.ts` + `_dashboard.composition.$compositionId.tsx`

## Done (recent)

- Academy rename (routes, settings key `academy_enabled`, migration 014)
- Formula diff on add-formula (vs baseline / prefill)
- Formula % bar on composition grid
- Number input: no value change on scroll-wheel

## Related docs

- [Inventory agent](./inventory-agent.md)