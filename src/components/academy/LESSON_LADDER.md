# Academy lesson ladder & material pool

## Section 1 pool — producer materials, ≤5 notes

Materials with an olfactive family and **≤5 unique producer notes** (Givaudan / Firmenich / Symrise / IFF).

| Category | Total | 1 note | 2 | 3 | 4 | 5 |
|----------|------:|-------:|--:|--:|--:|--:|
| floral | 39 | 0 | 0 | 6 | 21 | 12 |
| fruity | 17 | 0 | 1 | 3 | 7 | 6 |
| citrus | 11 | 0 | 0 | 0 | 8 | 3 |
| woody | 10 | 0 | 0 | 1 | 6 | 3 |
| green | 8 | 0 | 0 | 1 | 5 | 2 |
| herbal | 8 | 0 | 1 | 2 | 3 | 2 |
| spices | 8 | 0 | 0 | 1 | 3 | 4 |
| amber | 6 | 0 | 0 | 2 | 3 | 1 |
| musk | 6 | 0 | 1 | 0 | 3 | 2 |
| leather | 4 | 0 | 0 | 1 | 2 | 1 |
| gourmand | 2 | 0 | 0 | 0 | 1 | 1 |
| aldehydic | 1 | 0 | 0 | 0 | 1 | 0 |
| resinous / balsamic | 1 | 0 | 0 | 0 | 0 | 1 |
| sulfurous | 1 | 0 | 0 | 1 | 0 | 0 |
| **all** | **122** | **0** | **3** | **18** | **63** | **38** |

Context: **216** producer materials have a family; **67** are floral; **39** florals have ≤5 notes.

---

## Difficulty metric

- **Load** `L = picks × avgNotes` (memory dominates)
- **Quiz hardness** `C = C(options, correct)`
- **Score** `D = 10 × L + ln(C)`  
  (format only sorts within the same pick count; more picks always wins)

---

## Florals (unit 1)

Grow picks slowly; introduce `2/4` only after the same pick size with `1/4`.  
Cards used for `2/4` must have **≥2 producer notes**.

| Lesson | Picks | Format | Min notes | L (×3) | C | D |
|--------|------:|--------|----------:|-------:|--:|--:|
| 1 | 1 | `1/4` | 1 | 3 | 4 | 31.4 |
| 2 | 1 | `2/4` | 2 | 3 | 6 | 31.8 |
| 3 | 2 | `1/4` | 1 | 6 | 4 | 61.4 |
| 4 | 2 | `2/4` | 2 | 6 | 6 | 61.8 |
| 5 | 3 | `1/4` | 1 | 9 | 4 | 91.4 |
| 6 | 3 | `2/4` | 2 | 9 | 6 | 91.8 |

---

## More Florals

Always **1 pick**; escalate precision. Pool is accumulative (e.g. 9 cards, up to ~3 from prior families).  
Each lesson filters materials to **min notes** for that format.

| Lesson | Picks | Format | Min notes | C |
|--------|------:|--------|----------:|--:|
| 1 | 1 | `2/6` | 2 | 15 |
| 2 | 1 | `3/6` | 3 | 20 |
| 3 | 1 | `3/8` | 3 | 56 |
| 4 | 1 | `4/8` | 4 | 70 |
| 5 | 1 | `5/8` | 5 | 56 |

---

## Related code

- `utils/lessonDifficulty.ts` — ladders, `lessonFormatForLesson`, `quizFormatForLesson`
- `utils/generateQuestion.ts` — builds options from forced lesson format
- `curriculum.ts` — unit `lessonCount` / descriptions (`Florals`, `More Florals`)
- `MASTERY_DIFFICULTY.md` — per-material mastery bands (fallback when no lesson rung)