# CI/CD Pipeline Quick Start Guide

## For Developers

### Day-to-Day Workflow

#### 1. Creating a Feature Branch
```bash
git checkout -b feature/your-feature-name
# Make your changes
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

#### 2. Creating a Pull Request
- Go to GitHub and create a PR
- CI workflow will automatically run
- PR checks will validate your changes
- Wait for all checks to pass (green checkmarks)
- Request review from team members

#### 3. PR Title Format
Use semantic commit format:
- `feat: new feature description`
- `fix: bug fix description`
- `docs: documentation update`
- `refactor: code refactoring`
- `test: test changes`
- `ci: CI/CD changes`
- `chore: maintenance tasks`

#### 4. After PR Approval
- Merge to develop/main branch
- CI workflow runs again on the target branch
- For main branch: Staging deployment triggers automatically

### Viewing CI/CD Results

#### Check Workflow Status
1. Go to your PR on GitHub
2. Scroll down to see "Checks" section
3. Click "Details" next to any check to see logs

#### Download Build Artifacts
1. Go to Actions tab
2. Click on the workflow run
3. Scroll to "Artifacts" section
4. Download build artifacts or coverage reports

### Testing Locally Before Push

```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build the application
npm run build

# Check for vulnerabilities
npm audit
```

## For Maintainers

### Deploying to Staging
Staging deployment happens automatically when code is merged to `main` branch.

### Deploying to Production

#### Option 1: Create a Release Tag
```bash
# Make sure you're on main branch and up to date
git checkout main
git pull origin main

# Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

#### Option 2: Manual Deployment
1. Go to Actions tab
2. Click on "CD" workflow
3. Click "Run workflow" button
4. Select environment: `production`
5. Click "Run workflow"

### Managing Environments

#### GitHub Environments Configuration
1. Settings > Environments
2. Add `staging` and `production` environments
3. Configure protection rules:
   - Required reviewers for production
   - Deployment branches (main only)
4. Add environment secrets for deployment credentials

### Security Monitoring

#### Weekly Security Scans
- Run automatically every Monday at 9 AM UTC
- Check Actions tab for results
- Review and address vulnerabilities

#### Dependency Updates
1. Check Dependabot alerts
2. Review security advisories
3. Update vulnerable packages
4. Test thoroughly before merging

## Workflow Quick Reference

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| CI | Push/PR to main/develop | Build, test, quality checks |
| CD | Push to main or version tag | Deploy to staging/production |
| Security | Weekly + PR + Push to main | Vulnerability scanning |
| PR Checks | PR events | Validate PR metadata |

## Common Commands

```bash
# Local development
npm start                # Start dev server
npm test                 # Run tests
npm run build           # Production build

# Git operations
git status              # Check current status
git log --oneline -10   # View recent commits
git tag -l              # List all tags

# CI/CD triggers
git push origin main                    # Trigger CI + staging deploy
git push origin feature/branch-name     # Trigger CI only
git tag v1.0.0 && git push origin v1.0.0  # Trigger production deploy
```

## Troubleshooting

### CI Fails on Your PR
1. Check the error in workflow logs
2. Fix the issue locally
3. Commit and push the fix
4. CI will run automatically again

### Build Fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Tests Fail Locally
```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm test -- --coverage
```

## Getting Help

- **Workflow Issues**: Check `.github/workflows/` directory
- **Documentation**: See `.github/CICD_DOCUMENTATION.md`
- **Build Issues**: Review Create React App docs
- **Team Support**: Contact DevOps team

## Best Practices Checklist

- [ ] Write meaningful commit messages
- [ ] Test locally before pushing
- [ ] Keep PRs small and focused
- [ ] Update documentation when needed
- [ ] Address security vulnerabilities promptly
- [ ] Review CI/CD logs when failures occur
- [ ] Tag releases with semantic versioning
- [ ] Keep dependencies up to date
