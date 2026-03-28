# Inventory AI Agent – Technical Design Document (Conceptual)

## 1) Problem

When users add a raw material to inventory, they often need to search external sources for properties, then return to the app to complete the form.

This creates:
- Context switching and slower completion
- Incomplete or inconsistent field entry
- Higher chance of creating duplicate materials
- Repeated note records that already exist in the database

## 2) Why This Matters

Inventory entry is a high-frequency workflow. Every interruption increases friction and lowers data quality.

Business and product impact:
- Slower form completion
- Duplicate records across materials and notes
- Lower confidence in inventory data
- More cleanup effort over time

## 3) Product Vision

Users should complete inventory entry end-to-end inside the app with AI guidance that is:
- In-flow
- Deterministic
- Structured to match the form
- Explicitly duplication-aware (materials and notes)

The assistant should feel like a guided copilot, not an open-ended chatbot.

## 4) Core User Need

“I want to add the right material quickly, with accurate structured data, without creating duplicates.”

Users need:
- Fast material guidance in context
- Duplicate prevention before committing data
- Clear choices at each branch of the flow
- Easy path to revise or switch candidate material

## 5) Scope (Conceptual V1)

In scope:
- In-app assistant for material entry
- Duplicate checks for material records
- Duplicate checks for already available note entries in DB
- Deterministic yes/no gate when duplicate risk is detected
- Form-aligned structured proposal
- Three explicit post-proposal actions:
  - Add to Form
  - Retry
  - Add New Material

Out of scope:
- Fully autonomous submission
- Full regulatory/compliance automation
- Advanced bulk import workflows

## 6) Experience Principles

- **Stay in flow:** users should not need to leave the app
- **Be deterministic:** high-risk branches use explicit fixed choices
- **Prevent duplication early:** check existing materials and notes before proposing
- **Schema-first output:** proposed data mirrors form structure
- **Keep user in control:** user explicitly decides whether to apply, retry, or switch

## 7) Conceptual Workflow

### Step A: Initial Prompt
Assistant starts with:
**“What material do you want to add?”**

### Step B: Duplicate Awareness
Assistant evaluates candidate against:
1. Existing material entries
2. Existing note entries in DB (to avoid repeated note content where possible)

If duplicate risk is found, assistant asks for explicit decision:
- **Yes** = continue with this candidate
- **No** = restart candidate loop

### Step C: Yes/No Decision Gate
Deterministic gate with only two options:
- **Yes:** proceed to generate structured proposal
- **No:** reset candidate-specific context and ask again:
  **“What material do you want to add?”**

### Step D: Structured Proposal
Assistant returns a breakdown of what it proposes to add, using the same conceptual structure as the inventory form fields.

### Step E: Post-Proposal Action Gate
User chooses exactly one UI action:

1. **Add to Form**
   - Accept proposal
   - Auto-complete form with structured data
   - User may still manually edit before final save

2. **Retry**
   - User gives feedback in follow-up prompt
   - Assistant retries/refines data gathering using that feedback
   - Assistant returns revised form-aligned proposal

3. **Add New Material**
   - Discard current candidate/proposal
   - Refresh candidate-specific context
   - Restart with:
     **“What material do you want to add?”**

## 8) Duplicate Prevention Strategy (Conceptual)

The assistant should minimize duplication across two layers:

### 1) Material-level Duplication
- Detect likely existing material entries before building a new proposal
- Force explicit user decision when overlap is likely

### 2) Note-level Duplication
- Check existing note entries from DB before proposing new notes
- Prefer reusing or referencing existing note content patterns when appropriate
- Avoid generating redundant note entries that add no new value
- Surface uncertainty when note similarity is high but not exact

Goal: reduce duplicate creation “as much as possible” while still allowing user override.

## 9) Conversation Model

### Normal Path
- Candidate provided
- No significant duplication risk
- Structured proposal returned
- User chooses Add to Form / Retry / Add New Material

### Duplicate-Risk Path
- Duplicate signals found (material and/or notes)
- Yes/No gate is required
- No leads to loop restart
- Yes proceeds to structured proposal

### Retry Path
- User feedback refines proposal quality
- Revised proposal returned in the same structure
- User again chooses among the three actions

## 10) Success Criteria

Primary outcomes:
- Faster completion of inventory form
- Fewer duplicate material entries
- Fewer duplicate note entries
- Reduced user context switching outside app

Behavioral outcomes:
- High completion rate through deterministic gates
- Strong adoption of structured proposal-to-form flow
- Lower manual correction burden after auto-fill

## 11) Risks and Mitigations

- **Risk:** flow feels too rigid  
  **Mitigation:** keep prompts short, action choices clear, and retry always available

- **Risk:** false-positive duplicate warnings  
  **Mitigation:** allow explicit continue path and clear wording

- **Risk:** note dedup may suppress useful nuance  
  **Mitigation:** prefer “reuse where possible” rather than hard blocking new notes

- **Risk:** user confusion in multi-turn conversations  
  **Mitigation:** reset candidate context on “No” and “Add New Material”

## 12) Assumptions

- Deterministic branching improves completion and consistency
- Form-aligned output is more usable than free-form prose
- Users accept controlled action gates if they reduce mistakes
- Note-level duplicate checks improve long-term data hygiene

## 13) Open Product Questions

- What similarity threshold should trigger material duplicate warning?
- What similarity threshold should trigger note duplication warning?
- Should note dedup suggest existing note reuse explicitly to user?
- Should “Add to Form” include confidence hints per field?
- When should duplicate checks be strict vs advisory?

## 14) Definition of Success (Conceptual DoD)

The feature is successful when users can:
- Stay in-app for most inventory lookups
- Move through a predictable guided loop
- Avoid duplicate material and note entries by default
- Apply structured data to the form quickly
- Recover cleanly via Retry or Add New Material without conversation drift