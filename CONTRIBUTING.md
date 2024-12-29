# Contributor manual

## Repository

We have two main branches, `main` and `next`. `main` contains the source code of the latest published version of the library and docs. `next` contains the source code of the upcoming version.

We also have `v3` etc branch for upcoming major releases.

## Contributing to the docs

We welcome all contributions to the docs. Arctic uses [Malta](https://malta-cli.pages.dev) for generating documentation sites. All pages are markdown files located in the `docs/pages` directory. Make sure to update `malta.config.json` if you need a page to appear in the sidebar. We are aware of the limitations with using a very basic docs generator, but we believe it's good enough for this project.

PRs for changes to the docs should made against the `main` branch.

## Contributing to the source code

We are open to most contributions, but please open a new issue before creating a pull request, especially for new features. It's likely your PR will be rejected if not. We have intentionally limited the scope of the project and we would like to keep the package lean.

PRs for changes to the library source code should made against the `next` branch.

### Set up

Install dependencies with PNPM.

```
pnpm i
```

### Testing

Run `pnpm test` to run tests and `pnpm build` to build the package.

```
pnpm test

pnpm build
```
