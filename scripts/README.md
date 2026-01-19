# Scripts Directory

This directory contains automation scripts for the env-manager project.

## Available Scripts

### 🚀 Release Scripts

#### `release.sh` - Full Release Workflow

Automated script for version releases with changelog updates and git tagging.

**Usage:**

```bash
# For Windows (using Git Bash or WSL)
./scripts/release.sh [patch|minor|major]

# Or using npm scripts
pnpm run release:patch    # Bump patch version (1.0.0 -> 1.0.1)
pnpm run release:minor    # Bump minor version (1.0.0 -> 1.1.0)
pnpm run release:major    # Bump major version (1.0.0 -> 2.0.0)
```

**Features:**

- Automatic version bumping
- CHANGELOG.md updates
- Git commit with proper message
- Annotated tag creation
- Push to remote repository

#### `quick-commit.sh` - Daily Commits

Simple script for daily development commits without version changes.

**Usage:**

```bash
# Interactive mode
./scripts/quick-commit.sh

# With arguments
./scripts/quick-commit.sh feat "add new login feature"
```

**Features:**

- Interactive commit type selection
- Conventional commit format
- Optional push to remote
- Git status preview

## 📋 Package.json Scripts

The project includes several utility scripts in package.json:

### Version Management

- `pnpm run version-check` - Show current version
- `pnpm run changelog-check` - Show changelog content

### Release Automation

- `pnpm run release:patch` - Patch release (bug fixes)
- `pnpm run release:minor` - Minor release (new features)
- `pnpm run release:major` - Major release (breaking changes)

## 🔄 Workflow Examples

### Daily Development

```bash
# Make your changes...
./scripts/quick-commit.sh feat "add user authentication"
```

### Feature Release

```bash
# 1. Update CHANGELOG.md with your changes
# 2. Run release script
pnpm run release:minor
```

### Bug Fix Release

```bash
# 1. Update CHANGELOG.md with bug fixes
# 2. Run patch release
pnpm run release:patch
```

## 🛠️ Requirements

- Git
- Node.js
- pnpm (or npm)
- Bash shell (for .sh scripts)

**Windows Users:** Use Git Bash, WSL, or PowerShell with bash support.

## 📝 Notes

- Always update CHANGELOG.md before releasing
- Follow semantic versioning
- Use conventional commit messages
- Test thoroughly before releasing

## 🚨 Troubleshooting

### Script Permission Issues (Linux/macOS)

```bash
chmod +x scripts/*.sh
```

### Windows Compatibility

- Use Git Bash for shell scripts
- Or use npm scripts instead

### Git Issues

```bash
# Clean working directory before release
git status
git add .
git commit -m "wip: final changes before release"
```
