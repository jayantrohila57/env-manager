# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Version management and commit workflow scripts
- Automated release scripts with semantic versioning
- Comprehensive documentation for development workflow
- CHANGELOG.md with proper formatting
- Environment validation skip option via SKIP_ENV_VALIDATION flag

### Changed

### Deprecated

### Removed

### Fixed

### Security

---

## [1.0.0] - 2025-01-19

### Added

- Initial project structure with Better-T-Stack
- TypeScript configuration
- Next.js full-stack application
- TailwindCSS and shadcn/ui components
- tRPC for type-safe APIs
- Drizzle ORM with PostgreSQL
- Better-Auth authentication
- Biome for linting and formatting
- Husky git hooks
- PWA support
- Turborepo monorepo setup

---

## How to Update This Changelog

1. Add new entries under the `[Unreleased]` section
2. When releasing a new version:
   - Move changes from `[Unreleased]` to the new version section
   - Add the release date
   - Update the version number following semantic versioning
   - Remove the empty `[Unreleased]` header if no changes remain

## Version Format

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

Example: `1.2.3` means MAJOR=1, MINOR=2, PATCH=3
