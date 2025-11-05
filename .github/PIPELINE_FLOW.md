# CI/CD Pipeline Flow Diagram

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Repository                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├──── Push/PR to develop/main
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CI Workflow (ci.yml)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Node 18.x   │  │  Node 20.x   │  │ Code Quality │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ • Checkout   │  │ • Checkout   │  │ • Checkout   │          │
│  │ • Install    │  │ • Install    │  │ • Install    │          │
│  │ • Lint       │  │ • Lint       │  │ • Audit      │          │
│  │ • Test       │  │ • Test       │  │ • Bundle     │          │
│  │ • Build      │  │ • Build      │  │   Size       │          │
│  │              │  │ • Upload     │  │              │          │
│  │              │  │   Artifacts  │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├──── All checks pass ✓
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Security Workflow (security.yml)                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dependency  │  │   Security   │  │    CodeQL    │          │
│  │   Review     │  │    Audit     │  │   Analysis   │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ • Check PRs  │  │ • npm audit  │  │ • Initialize │          │
│  │ • Analyze    │  │ • High/Crit  │  │ • Autobuild  │          │
│  │   deps       │  │   Check      │  │ • Analyze    │          │
│  │ • Report     │  │ • Upload     │  │ • Report     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PR Checks (pr-checks.yml)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PR Metadata  │  │Commit Linting│  │Changed Files │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ • Title      │  │ • Validate   │  │ • Track      │          │
│  │   Format     │  │   Messages   │  │   Changes    │          │
│  │ • Semantic   │  │ • Log        │  │ • List Files │          │
│  │   Type       │  │   Commits    │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├──── Merge to main
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CD Workflow (cd.yml)                          │
├─────────────────────────────────────────────────────────────────┤
│                     Staging Deployment                           │
│  ┌───────────────────────────────────────────────────┐          │
│  │ • Checkout code                                   │          │
│  │ • Setup Node.js 20.x                              │          │
│  │ • Install dependencies                            │          │
│  │ • Build application                               │          │
│  │ • Deploy to staging environment                   │          │
│  │ • Create deployment summary                       │          │
│  └───────────────────────────────────────────────────┘          │
│                              │                                   │
│                              │ Staging URL:                      │
│                              │ https://staging.example.com       │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │ Manual Testing  │                          │
│                    │   & Approval    │                          │
│                    └─────────────────┘                          │
│                              │                                   │
│                              ├──── Create version tag            │
│                              │     (e.g., v1.0.0)                │
│                              ▼                                   │
│                   Production Deployment                          │
│  ┌───────────────────────────────────────────────────┐          │
│  │ • Checkout code                                   │          │
│  │ • Setup Node.js 20.x                              │          │
│  │ • Install dependencies                            │          │
│  │ • Run tests (safety check)                        │          │
│  │ • Build application                               │          │
│  │ • Deploy to production environment                │          │
│  │ • Create GitHub release                           │          │
│  │ • Create deployment summary                       │          │
│  └───────────────────────────────────────────────────┘          │
│                              │                                   │
│                              │ Production URL:                   │
│                              │ https://production.example.com    │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │   Release v1.0.0 │                          │
│                    │   Published      │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

## Workflow Trigger Matrix

| Event Type        | CI | Security | PR Checks | CD Staging | CD Production |
|-------------------|----|----------|-----------|------------|---------------|
| Push to develop   | ✓  | ✗        | ✗         | ✗          | ✗             |
| Push to main      | ✓  | ✓        | ✗         | ✓          | ✗             |
| Pull Request      | ✓  | ✓        | ✓         | ✗          | ✗             |
| Version Tag (v*.) | ✗  | ✗        | ✗         | ✗          | ✓             |
| Weekly Schedule   | ✗  | ✓        | ✗         | ✗          | ✗             |
| Manual Trigger    | ✗  | ✓        | ✗         | ✓          | ✓             |

## Deployment Flow

```
Developer → Feature Branch → Pull Request
                                  │
                                  ├─── CI Workflow
                                  ├─── Security Scan
                                  ├─── PR Checks
                                  │
                                  ▼
                            Code Review
                                  │
                                  ▼
                          Merge to develop
                                  │
                                  ├─── CI Workflow
                                  │
                                  ▼
                            Testing Period
                                  │
                                  ▼
                          Merge to main
                                  │
                                  ├─── CI Workflow
                                  ├─── Security Scan
                                  │
                                  ▼
                       Automatic Staging Deploy
                                  │
                                  ▼
                         QA/UAT Testing
                                  │
                                  ▼
                    Create Release Tag (v1.0.0)
                                  │
                                  ▼
                     Automatic Production Deploy
                                  │
                                  ▼
                          GitHub Release
                                  │
                                  ▼
                         Production Live 🎉
```

## Artifact Flow

```
┌─────────────┐
│  Source     │
│  Code       │
└──────┬──────┘
       │
       ├─── CI Workflow
       │         │
       │         ├─── Build Artifacts
       │         │    • build/ directory
       │         │    • Static assets
       │         │    • Retention: 7 days
       │         │
       │         └─── Coverage Reports
       │              • coverage/ directory
       │              • HTML reports
       │              • Retention: 7 days
       │
       └─── Security Workflow
                 │
                 └─── Security Reports
                      • npm audit JSON
                      • CodeQL results
                      • Retention: 30 days
```

## Parallel Execution

The CI workflow uses matrix strategy for parallel execution:

```
┌─────────────────────────────────────┐
│         CI Workflow Start            │
└───────────────┬─────────────────────┘
                │
                ├──────────┬──────────┬─────────────┐
                │          │          │             │
                ▼          ▼          ▼             ▼
         ┌──────────┐┌──────────┐┌──────────┐┌──────────┐
         │Node 18.x ││Node 20.x ││  Code    ││Additional│
         │   Job    ││   Job    ││ Quality  ││  Jobs    │
         └────┬─────┘└────┬─────┘└────┬─────┘└────┬─────┘
              │           │           │           │
              └───────────┴───────────┴───────────┘
                          │
                          ▼
                  All Jobs Complete
```

## Error Handling

```
┌─────────────┐
│ Workflow    │
│ Execution   │
└──────┬──────┘
       │
       ├─── Step Fails
       │      │
       │      ├─── continue-on-error: true
       │      │    └─── Workflow continues
       │      │
       │      └─── continue-on-error: false (default)
       │           └─── Workflow stops, mark as failed
       │
       └─── All Steps Complete
                │
                ├─── Success ✓
                └─── Failure ✗
```

## Environment Protection

```
Production Environment
    │
    ├─── Protection Rules
    │    ├─── Required Reviewers: 1+
    │    ├─── Wait Timer: Optional
    │    └─── Allowed Branches: main only
    │
    ├─── Secrets
    │    ├─── AWS_ACCESS_KEY_ID
    │    ├─── AWS_SECRET_ACCESS_KEY
    │    └─── Other deployment credentials
    │
    └─── Deployment
         └─── Manual approval required
              before deployment executes
```

## Badge Status Flow

```
README.md
    │
    ├─── CI Badge
    │    ├─── Passing ✓ (Green)
    │    ├─── Failing ✗ (Red)
    │    └─── In Progress ⋯ (Yellow)
    │
    ├─── CD Badge
    │    └─── Status of last deployment
    │
    └─── Security Badge
         └─── Status of last security scan
```

## Weekly Schedule

```
                Monday 9:00 AM UTC
                        │
                        ▼
                ┌───────────────┐
                │   Security    │
                │   Workflow    │
                │   Triggered   │
                └───────────────┘
                        │
                        ├─── Dependency Audit
                        ├─── npm Audit
                        └─── CodeQL Scan
                        │
                        ▼
                  Results Published
                        │
                        └─── Alerts if issues found
```

## Key Decision Points

1. **Branch Protection**: Should CI pass before merge?
   - Recommended: Yes, make CI required

2. **Deployment Approval**: Should production require manual approval?
   - Recommended: Yes, for production environment

3. **Test Coverage**: What's the minimum acceptable coverage?
   - Configure in CI workflow if needed

4. **Security Threshold**: What severity level should block deployment?
   - Currently: Moderate+ for dependency review

5. **Artifact Retention**: How long to keep build artifacts?
   - Current: 7 days (builds), 30 days (security)
