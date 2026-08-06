# Academy mastery difficulty

How quiz formats are chosen from a material’s **mastery (0–20)** and **note count**.

## Rules

1. Mastery is split into **N equal bands** for an **N-note** material (`step = 20 / N`).
2. Band index `0 … N-1` picks **stage** `1 … N`.
3. Each stage has a pool of formats; one is chosen **at random**.
4. Formats are always clamped so `correct ≤ noteCount`.

Band formula:

    band = min(N - 1, floor(mastery / (20 / N)))

## Stage → format pools

| Stage | Random pick among | Approx. luck (exact set) |
|-------|-------------------|--------------------------|
| 1 | `1/4` | 25% |
| 2 | `2/4` · `1/6` · `2/6` | ~17% / ~17% / ~7% |
| 3 | `3/6` · `2/8` · `3/8` | 5% / ~3.6% / ~1.8% |
| 4 | `4/8` | ~1.4% |
| 5 | `5/8` | ~1.8% |

Notation: **`k/n`** = select exactly **k** correct notes out of **n** options.

---

## 2-note material *(2 bands × 10)*

| Mastery | Stage | Random pick among |
|---------|-------|-------------------|
| 0–10 | 1 | `1/4` |
| 10–20 | 2 | `2/4` · `1/6` · `2/6` |

---

## 3-note material *(3 bands × ~6.67)*

| Mastery | Stage | Random pick among |
|---------|-------|-------------------|
| 0–7 | 1 | `1/4` |
| 7–14 | 2 | `2/4` · `1/6` · `2/6` |
| 14–20 | 3 | `3/6` · `2/8` · `3/8` |

---

## 4-note material *(4 bands × 5)*

| Mastery | Stage | Random pick among |
|---------|-------|-------------------|
| 0–5 | 1 | `1/4` |
| 5–10 | 2 | `2/4` · `1/6` · `2/6` |
| 10–15 | 3 | `3/6` · `2/8` · `3/8` |
| 15–20 | 4 | `4/8` |

---

## 5-note material *(5 bands × 4)*

| Mastery | Stage | Random pick among |
|---------|-------|-------------------|
| 0–4 | 1 | `1/4` |
| 4–8 | 2 | `2/4` · `1/6` · `2/6` |
| 8–12 | 3 | `3/6` · `2/8` · `3/8` |
| 12–16 | 4 | `4/8` |
| 16–20 | 5 | `5/8` |

---

## Related code

- `utils/lessonDifficulty.ts` — `masteryBandIndex`, `formatsForStage`, `pickFormatForMaterial`
- `utils/generateQuestion.ts` — builds options from the chosen format
- Mastery score: `utils/materialMastery.ts` (`MASTERY_TARGET = 20`)

## Lesson track vs mastery

- **Lesson map node** controls how many materials to pick (3→6) and can later set a soft difficulty era.
- **Per-question format** comes from the mastery bands above (not from lesson index).