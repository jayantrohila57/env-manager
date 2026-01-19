# Commit Workflow Guide

This guide outlines the step-by-step process for committing code with proper version management, changelog updates, and version tagging.

## 🚀 Complete Commit Workflow

### Step 1: Check Current Version

```bash
# Check current version in package.json
cat package.json | grep '"version"'

# Check latest git tag
git tag --sort=-version:refname | head -5
```

### Step 2: Update Version (if needed)

```bash
# Update version manually in package.json
# OR use npm version commands (recommended)
npm version patch   # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor   # 1.0.0 -> 1.1.0 (new features)
npm version major   # 1.0.0 -> 2.0.0 (breaking changes)
```

### Step 3: Update CHANGELOG.md

```bash
# Edit CHANGELOG.md
# 1. Add changes under [Unreleased] section
# 2. Move changes to new version section if releasing
# 3. Add release date
# 4. Follow semantic versioning format
```

### Step 4: Stage and Commit Changes

```bash
# Stage all changes
git add .

# Commit with detailed message
git commit -m "feat: add new feature description

- Add specific change 1
- Add specific change 2
- Update CHANGELOG.md

Closes #123"
```

### Step 5: Create Version Tag

```bash
# Create and push tag
git tag -a v1.0.1 -m "Release v1.0.1: Add new feature description"

# Push commit and tag
git push origin main
git push origin v1.0.1
```

## 📋 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples:

```
feat(auth): add OAuth2 integration

- Add Google OAuth provider
- Update auth middleware
- Add user profile endpoints

Closes #45
```

```
fix(db): resolve connection pool timeout

- Increase connection timeout to 30s
- Add retry logic for failed connections
- Update error handling
```

## 🔄 Automated Script

Use the provided `release.sh` script for automated releases:

```bash
# Make script executable
chmod +x scripts/release.sh

# Run release (patch version)
./scripts/release.sh patch

# Run release (minor version)
./scripts/release.sh minor

# Run release (major version)
./scripts/release.sh major
```

## ✅ Pre-Commit Checklist

Before committing, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version number is appropriate
- [ ] No sensitive data is committed
- [ ] Build passes successfully

## 🏷️ Version Tagging Strategy

- Tags follow semantic versioning: `v1.2.3`
- Always use annotated tags with descriptions
- Tags should match the version in package.json
- Push tags immediately after creating them

## 📝 Release Notes Template

When creating a release:

```markdown
## [1.2.3] - 2025-01-19

### Added

- New feature description
- Another new feature

### Changed

- Updated existing functionality

### Fixed

- Bug fix description
- Another bug fix

### Security

- Security improvement description
```

## 🚨 Important Notes

1. **Never commit directly to main branch** - use feature branches
2. **Always update CHANGELOG.md** before tagging
3. **Use semantic versioning** for version numbers
4. **Test thoroughly** before releasing
5. **Backup database** if this is a production release
6. **Communicate changes** to team members

## 🛠️ Troubleshooting

### If tag already exists:

```bash
# Delete local tag
git tag -d v1.0.1

# Delete remote tag
git push origin --delete v1.0.1

# Recreate tag
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

### If commit message needs fixing:

```bash
# Amend last commit (if not pushed)
git commit --amend

# If already pushed, create new commit
git commit --amend
git push --force-with-lease origin main
```

### If version needs updating:

```bash
# Update version and create new commit
npm version patch --no-git-tag-version
git add package.json
git commit -m "chore: bump version to 1.0.1"
```
