# 0003. Shared Zod schema and error handling by tRPC code

- Status: Accepted
- Date: 2026-11-16

## Context

A task needs a title, validated in the browser for UX and on the server for correctness. Failed operations (such as updating a missing task) must return meaningful errors that the UI shows.

## Decision

- `api/schemas/task` defines `taskInputSchema`, used as the tRPC `.input()` and as the react-hook-form `zodResolver`. Its messages are i18n keys (`titleRequired`) translated by the UI. Dates (`dataCriacao`) are ISO strings so they pass from Server to Client Components without a transformer.
- The server throws `TRPCError` `NOT_FOUND` for unknown ids; Zod failures become `BAD_REQUEST`. `getErrorKey` (`lib/trpc-error.ts`) maps the code to an i18n key and components show it in a toast or inline. Server messages are never shown directly.

## Consequences

- Client and server rules cannot drift, and the server still rejects bad input if the form is bypassed.
- Consumers must translate the message keys. A new error code needs one line in `getErrorKey` and a key in both locales.
