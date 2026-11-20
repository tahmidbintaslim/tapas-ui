# Security policy

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Report it privately through a GitHub security advisory:
https://github.com/tahmidbintaslim/tapas-ui/security/advisories/new

Only the maintainer can see the report. Include what you found, where (file, route or
section), and the steps to reproduce it. You will get a reply on the advisory.

## Scope

- The sections and templates installed from the registry (`registry.json`, `src/components/**`).
- The site at https://tapasui.tahmid.space, including the demo sites' waitlist routes
  (`src/app/examples/**/api/waitlist`).

Copied sections become your code: once installed, keeping them patched is up to your
project. Fixes land on `main` and in the registry, so re-running the install command picks
them up.

## Supported versions

Tapas UI is not versioned or published to npm. Only the current `main` branch is supported.
