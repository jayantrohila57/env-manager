# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-19

### Added

- Environment management core infrastructure
- Projects, environments, and variables database schema
- New API routers for environment management
- Database migrations for environment management features
- Comprehensive project plan and development roadmap

### Changed

- Refactored from todo-based to environment management system
- Updated authentication flow for new use case
- Removed placeholder todo functionality
- Updated database schema to support environment variables
- Modified API structure for environment management endpoints

### Fixed

- Updated imports and dependencies after schema changes
- Fixed authentication integration with new project structure

---

## [Unreleased]

### Changed

- Improved landing page UI with modern hero section and better messaging
- Enhanced sign-in form styling and layout
- Updated various UI components for better user experience

## [1.2.0] - 2026-01-19

### Added

- Comprehensive Environment Management Dashboard
- Project Management: Create, edit, and delete projects with Card-based UI
- Environment Management: Multi-environment support with Tab-based navigation
- Advanced Variable Editor: Masked/Reveal values, Copy to Clipboard functionality
- Bulk Variable Management: Import multiple variables from .env paste; Export to clipboard
- Real-time Variable Search and Filtering by key
- Core API: Added `bulkImport` and `export` endpoints for environment variables
- UI: Refactored Header with centralized `siteConfig` and glassmorphism styling
- UI: Interactive micro-animations and loading states with Skeleton components

### Fixed

- Critical bug in `variables.update` mutation preventing unintentional data overwrites

### Changed

- Centralized Branding: Integrated `siteConfig` across the application header
- Migrated Dashboard to a project-centric view

## [1.0.2] - 2025-01-19

### Added

- Version management and commit workflow scripts
- Automated release scripts with semantic versioning
- Comprehensive documentation for development workflow
- CHANGELOG.md with proper formatting
- Environment validation skip option via SKIP_ENV_VALIDATION flag

### Fixed

- Fixed turbo.json configuration with duplicate build tasks
- Updated environment validation logic to use string comparison
- Resolved Vercel build environment variable issues

### Changed

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
