# IFRA — deferred considerations (Category 4 focus)

Things IFRA covers that we are **not** modeling or enforcing yet.

---

## Product scope

- [ ] Formulas used in multiple categories — IFRA requires the most restrictive category to apply
- [ ] Assumption that all formulas are leave-on fine fragrance (Cat 4)

---

## Cross-material rules

- [ ] **Sum groups** — combined % caps (MHC+MOC, methyl ionone isomers, rose ketones, oak+treemoss, tolualdehydes)
- [ ] **Furocoumarin phototoxic group** — Σ (ingredient % ÷ its Cat 4 limit) × 100 ≤ 100 across:
  - Angelica, Bergamot, Bitter orange, Cumin, Grapefruit, Lemon, Lime, Rue (+ low-level: Petitgrain mandarin, Tangerine CP, Parsley leaf in combos)
- [ ] **Bergapten (5-MOP) cap** — 15 ppm in finished product when coumarin content is known per oil (`IFRA_STD_089.pdf` meta rule; not a single-oil Cat 4 limit)

---

## Material form & composition

- [ ] **Prohibition vs restriction splits** — crude vs extract/distillate (Peru balsam, Styrax, Verbena oils)
- [ ] **Specification standards** — require compositional data to enforce:
  - Pseudo methyl ionones in methyl ionone
  - Oakmoss / treemoss — DHA, atranol, chloroatranol limits
  - Opoponax / Styrax — PAH markers (bergapten + 1,2-benzanthracene, 1 ppb in final product)
  - Allyl esters, cyclamen aldehyde, farnesol, organochlorine, etc.
- [ ] **Terpene-stripped / concentrated citrus** — Cat 4 limits scale down with concentration factor
- [ ] **Phototoxic materials outside furocoumarin group** — AHMI, Verbena absolute (own standards; no furocoumarin combo math)

---

## Other IFRA guidance (not in data model)

- [ ] Flavor / IOFI requirements for Categories 1 & 6
- [ ] Contributions from other sources annex
- [ ] Implementation dates (supply of fragrance mixtures)
- [ ] Phototoxic ingredient guidance (Ch. 1) beyond simple Cat 4 caps