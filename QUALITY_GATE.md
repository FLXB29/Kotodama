# Quality gate

Use Node.js 22.12 or later (but below 26) and npm 10 or later. The supported Node version for local development and CI is defined in `.nvmrc` and `package.json`.

## Commands

| Command                 | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `npm run format`        | Apply the repository formatter                  |
| `npm run format:check`  | Verify formatting without changing files        |
| `npm run typecheck`     | TypeScript project validation                   |
| `npm run lint`          | Static code analysis; warnings are not accepted |
| `npm run test:frontend` | Frontend unit tests                             |
| `npm run test:server`   | Server unit and integration tests               |
| `npm run build`         | Production frontend build                       |
| `npm run quality`       | Full required quality gate                      |

`npm run quality` is the required pre-merge and pre-release check. It runs formatting, typecheck, lint, both test suites, and a production build in that order.
