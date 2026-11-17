---

title: Architecture Decision Records
description: When and how to write an ADR in docs/adr — numbering, template, status values. Load when making or changing an architectural decision (library choice, data flow, rendering strategy, deviation from the boilerplate conventions).
---

# ADRs

Write an ADR when a decision is hard to reverse, affects several modules, or deviates from the boilerplate conventions. Do not write one for local code style.

- Location: `docs/adr/NNNN-short-kebab-title.md`. Next number = highest existing + 1. Copy `0000-template.md`.
- One decision per ADR, written in English, a page at most. Sections: Status, Context, Decision, Consequences.
- Status: `Proposed` → `Accepted` → optionally `Superseded by NNNN`. Never rewrite history: to change a decision, add a new ADR and mark the old one superseded.
- Add the new ADR to the index in `docs/adr/README.md`.
