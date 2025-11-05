# CI/CD Pipeline Documentation

## Overview

This repository includes a comprehensive CI/CD pipeline built with GitHub Actions. The pipeline automates building, testing, security scanning, and deployment processes.

## Workflow Files

### 1. CI Workflow (`ci.yml`)

**Trigger Events:**
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop` branches

**Jobs:**

#### Build and Test
- **Purpose**: Validate code changes by building and testing on multiple Node.js versions
- **Node Versions**: 18.x, 20.x (matrix strategy)
- **Steps**:
  1. Checkout code
  2. Setup Node.js with npm caching
  3. Install dependencies (`npm ci`)
  4. Run linter (continue on error)
  5. Run tests with coverage (`CI=true npm test -- --coverage --watchAll=false`)
  6. Build application (`npm run build`)
  7. Upload build artifacts (Node 20.x only)
  8. Upload coverage reports (Node 20.x only)

#### Code Quality
- **Purpose**: Check code quality and bundle size
- **Node Version**: 20.x
- **Steps**:
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies
  4. Run security vulnerability check (`npm audit`)
  5. Build and analyze bundle size

**Artifacts:**
- `build-artifacts`: Production build files (7-day retention)
- `coverage-report`: Test coverage reports (7-day retention)

---

### 2. CD Workflow (`cd.yml`)

**Trigger Events:**
- Push to `main` branch
- Push tags matching `v*.*.*` pattern
- Manual workflow dispatch

**Jobs:**

#### Deploy to Staging
- **Trigger**: Push to main branch OR manual dispatch with staging environment
- **Environment**: `staging`
- **URL**: https://staging.example.com (placeholder)
- **Steps**:
  1. Checkout code
  2. Setup Node.js 20.x
  3. Install dependencies
  4. Build application
  5. Deploy to staging (placeholder - add your deployment commands)
  6. Create deployment summary

#### Deploy to Production
- **Trigger**: Push tags starting with 'v' OR manual dispatch with production environment
- **Environment**: `production`
- **URL**: https://production.example.com (placeholder)
- **Steps**:
  1. Checkout code
  2. Setup Node.js 20.x
  3. Install dependencies
  4. Run tests (safety check)
  5. Build application
  6. Deploy to production (placeholder - add your deployment commands)
  7. Create GitHub release (on tag push)
  8. Create deployment summary

**Environment Configuration:**
- Staging and production environments can have protection rules
- Environment secrets can be configured for deployment credentials

---

### 3. Security Workflow (`security.yml`)

**Trigger Events:**
- Scheduled: Every Monday at 9 AM UTC
- Push to `main` branch
- Pull requests targeting `main` branch
- Manual workflow dispatch

**Jobs:**

#### Dependency Review
- **Trigger**: Only on pull requests
- **Purpose**: Review dependency changes for security issues
- **Severity Threshold**: Moderate
- **Action**: Uses GitHub's dependency review action

#### Security Audit
- **Purpose**: Audit npm packages for known vulnerabilities
- **Steps**:
  1. Checkout code
  2. Setup Node.js 20.x
  3. Install dependencies
  4. Run npm audit (generate JSON report)
  5. Check for high/critical vulnerabilities
  6. Upload audit report (30-day retention)

#### CodeQL Analysis
- **Purpose**: Static code analysis for security vulnerabilities
- **Language**: JavaScript
- **Permissions Required**: 
  - `actions: read`
  - `contents: read`
  - `security-events: write`
- **Steps**:
  1. Checkout code
  2. Initialize CodeQL
  3. Autobuild
  4. Perform analysis

**Artifacts:**
- `security-audit-report`: npm audit results in JSON (30-day retention)

---

### 4. PR Checks Workflow (`pr-checks.yml`)

**Trigger Events:**
- Pull request opened, synchronized, or reopened

**Jobs:**

#### PR Metadata Check
- **Purpose**: Validate PR title format
- **Expected Format**: Semantic commit types
- **Valid Types**:
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation changes
  - `style`: Code style changes
  - `refactor`: Code refactoring
  - `perf`: Performance improvements
  - `test`: Test changes
  - `build`: Build system changes
  - `ci`: CI/CD changes
  - `chore`: Maintenance tasks
  - `revert`: Revert previous changes
- **Action**: Continues on error (non-blocking)

#### Lint Commit Messages
- **Purpose**: Validate commit messages in the PR
- **Action**: Lists all commits in the PR

#### Changed Files Check
- **Purpose**: Track and report changed files
- **Action**: Lists all files modified in the PR

---

## Setup Instructions

### Prerequisites
- GitHub repository with Actions enabled
- Node.js 18.x or 20.x
- npm package manager

### Environment Variables
No environment variables are required for basic operation. For deployments, configure:
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- Additional secrets for deployment targets (AWS credentials, Netlify tokens, etc.)

### GitHub Environments
Configure environments in repository settings:
1. Go to Settings > Environments
2. Create `staging` and `production` environments
3. Add protection rules (optional):
   - Required reviewers
   - Wait timer
   - Deployment branches
4. Add environment secrets for deployment

### Deployment Configuration

The CD workflow includes placeholder deployment commands. Replace them with your actual deployment commands:

**For AWS S3:**
```bash
aws s3 sync build/ s3://your-bucket-name
```

**For Netlify:**
```bash
netlify deploy --dir=build --prod
```

**For Vercel:**
```bash
vercel --prod
```

**For Azure Static Web Apps:**
```bash
az staticwebapp deploy --app-name your-app-name
```

---

## Usage Guide

### Running Workflows

#### CI Workflow
- Automatically runs on every push and PR to main/develop
- No manual intervention required

#### CD Workflow
- **Automatic Staging**: Push to main branch
- **Automatic Production**: Push a version tag (e.g., `v1.0.0`)
- **Manual Deployment**:
  1. Go to Actions tab
  2. Select "CD" workflow
  3. Click "Run workflow"
  4. Select environment (staging/production)
  5. Click "Run workflow" button

#### Security Workflow
- Runs automatically every Monday
- Can be triggered manually from Actions tab

#### PR Checks
- Automatically runs on all pull requests
- No manual intervention required

### Creating a Release

To trigger a production deployment:

```bash
# Tag the commit
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push the tag
git push origin v1.0.0
```

This will:
1. Trigger the CD workflow
2. Run production deployment
3. Create a GitHub release

---

## Monitoring and Troubleshooting

### Viewing Workflow Runs
1. Navigate to the "Actions" tab in your repository
2. Select the workflow you want to view
3. Click on a specific run to see details

### Checking Workflow Status
Status badges in README.md show current workflow status:
- [![CI](badge-url)](workflow-url)
- [![CD](badge-url)](workflow-url)
- [![Security Scan](badge-url)](workflow-url)

### Common Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are correctly installed
- Review build logs for specific errors

#### Test Failures
- Tests may fail due to missing dependencies
- Check if tests require environment variables
- Review test logs for specific failures

#### Deployment Failures
- Verify deployment credentials are correctly configured
- Check environment secrets are set
- Ensure deployment target is accessible

#### Security Scan Failures
- Review vulnerability report in artifacts
- Update vulnerable dependencies
- Check if vulnerabilities have patches available

---

## Maintenance

### Updating Workflows
1. Edit workflow files in `.github/workflows/`
2. Test changes in a feature branch
3. Create PR to merge changes
4. Workflow changes take effect immediately after merge

### Updating Dependencies
- Dependabot can be configured to automatically update dependencies
- Review security alerts regularly
- Test dependency updates before merging

### Artifact Cleanup
- Build artifacts: 7-day retention
- Coverage reports: 7-day retention
- Security reports: 30-day retention
- Adjust retention in workflow files if needed

---

## Best Practices

1. **Branch Protection**: Enable branch protection rules for main branch
2. **Required Checks**: Make CI workflow required for PR merging
3. **Environment Protection**: Use environment protection rules for production
4. **Secrets Management**: Store sensitive data in GitHub Secrets
5. **Regular Updates**: Keep dependencies and GitHub Actions up to date
6. **Monitor Security**: Review security scan results regularly
7. **Test Locally**: Test changes locally before pushing
8. **Meaningful Commits**: Use semantic commit messages

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [GitHub Security Features](https://docs.github.com/en/code-security)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
