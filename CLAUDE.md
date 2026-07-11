# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Car Care Backend — a [NestJS](https://nestjs.com) (v11) TypeScript API. This is currently a freshly scaffolded `nest new` project (default starter files only: `AppController`/`AppService`/`AppModule`); no database, auth, or domain modules have been added yet.

## Commands

```bash
# install
npm install

# run
npm run start          # standard
npm run start:dev      # watch mode
npm run start:prod      # run compiled dist/main.js (requires build first)

# build
npm run build           # nest build -> dist/

# lint / format
npm run lint             # eslint --fix over src, apps, libs, test
npm run format            # prettier --write over src/**/*.ts and test/**/*.ts

# tests
npm run test              # unit tests (jest, rootDir src, matches *.spec.ts)
npm run test:watch
npm run test:cov
npm run test:e2e          # e2e tests via test/jest-e2e.json (matches test/**/*.e2e-spec.ts)
npm run test:debug        # jest --inspect-brk, runInBand

# run a single test file
npx jest path/to/file.spec.ts
npx jest -t "test name substring"
```

## Architecture

Standard NestJS module structure, rooted at `src/`:
- `src/main.ts` — bootstraps the app via `NestFactory.create(AppModule)` and listens on `process.env.PORT ?? 3000`.
- `src/app.module.ts` — root module; wires together controllers/providers/imports. New feature modules should be registered here (or nested under their own module and imported here).
- Controllers (`*.controller.ts`) handle HTTP routing; services (`*.service.ts`) hold business logic and are injected into controllers via Nest's DI. Follow this controller/service/module split for any new feature.

## TypeScript config notes

- Module system is `nodenext` with `esModuleInterop` — matters for how imports resolve.
- `strictNullChecks` is on, but `noImplicitAny` is off — existing code is not fully strict.
- Decorators (`experimentalDecorators`, `emitDecoratorMetadata`) are enabled, required for Nest's DI/annotations.

## Lint config notes

- ESLint uses `typescript-eslint`'s `recommendedTypeChecked` ruleset plus `eslint-plugin-prettier`, so lint errors can include type-aware rules, not just style.
- `no-explicit-any` is disabled; `no-floating-promises` and `no-unsafe-argument` are set to `warn` rather than `error`.

## Testing

- Unit tests live alongside source files as `*.spec.ts` (Jest config in `package.json`, `rootDir: src`).
- E2E tests live in `test/*.e2e-spec.ts`, run against a full Nest app instance created via `Test.createTestingModule` + `app.init()` (see `test/app.e2e-spec.ts`).
