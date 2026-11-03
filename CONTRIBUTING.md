# Contributing to Brian E-commerce

Thanks for considering a contribution!

## Setup

See the [Getting started](README.md#getting-started) section in the README.

## Workflow

1. Fork the repo and create a branch: `git checkout -b feature/short-description`
2. Keep PRs focused — one feature or fix per PR.
3. Run tests and lint before pushing:
   - Backend: `cd backend && npm test && npm run lint`
   - Frontend: `cd frontend && npm run lint`
4. Open a PR against `main`, describing what changed and why. Link any
   related issue.

## Code style

- TypeScript, strict mode on, in both `backend/` and `frontend/`.
- Prefer small, composable functions and components.

## Good first issues

Look for issues tagged `good-first-issue`.

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
