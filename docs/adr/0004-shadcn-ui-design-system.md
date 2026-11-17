# 0004. shadcn/ui as the design system

- Status: Accepted
- Date: 2026-11-16

## Context

The case asks for a simple layout; the team chose shadcn/ui as the design system.

## Decision

Use shadcn/ui components (Radix primitives + Tailwind 4 tokens in `src/styles/global/index.css`). Files live in `components/ui/<Name>/` following the folder-per-module convention, with named-export `index.ts` files. Components were generated with `shadcn@4.22.0`, then moved into their folders with imports rewritten to `@Libs/utils` and `@Ui/Button`. Re-running the CLI produces flat files (and a bare `"cn"` import) that need the same cleanup. shadcn code uses `cn()` (`@Libs/utils`, clsx + tailwind-merge), a deliberate exception to the boilerplate's `classnames` rule.

## Consequences

- We own the component source and can edit it freely.
- Two class-merging helpers exist; `cn()` is only for shadcn-style variants where Tailwind conflicts must be resolved.
