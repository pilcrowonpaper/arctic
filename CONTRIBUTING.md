# Contributor manual

## Contributing to the docs

We welcome all contributions to the docs, especially grammar fixes. Arctic uses [Malta](https://malta-cli.pages.dev) for generating documentation sites. All pages are markdown files located in the `docs/pages` directory. Make sure to update `malta.config.json` if you need a page to appear in the sidebar.

## Contributing to the source code

We are open to most contributions, but please open a new issue before creating a pull request, especially for new features. It's likely your PR will be rejected if not. We have intentionally limited the scope of the project and we would like to keep the package lean.

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

### Creating changesets

When creating a PR, create a changeset with `pnpm auri add`. If you made multiple changes, create multiple changesets. Use `minor` for new features, and use `patch` for bug fixes:

```
pnpm auri add minor
pnpm auri add patch
```

A new markdown file should be created in `.changesets` directory. Write a short summary of the change:

```
Fix: Handle negative numbers in `sqrt()`
```

```
Feat: Add `greet()`
```
