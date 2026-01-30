# Quick Start - Execute Implementation Plan

## Prerequisites

- Docker Desktop installed and running
- Node.js 20+ (for Vercel CLI)
- Git configured

## Execute with Claude-Flow

### Option 1: Full Swarm Execution

```bash
# Initialize swarm
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized

# Execute implementation plan (Claude Code will spawn agents)
# Say: "Execute docs/execution/IMPLEMENTATION_PLAN.md with claude-flow"
```

### Option 2: Manual Phase Execution

#### Phase 1: Validation
```bash
# Start Docker
open -a Docker

# Build container
docker compose --profile dev up -d --build

# Install deps
docker exec meeting-bingo-dev npm install

# Type check
docker exec meeting-bingo-dev npm run typecheck

# Lint
docker exec meeting-bingo-dev npm run lint
```

#### Phase 2: Local Build
```bash
# Production build
docker exec meeting-bingo-dev npm run build

# Preview build
docker exec meeting-bingo-dev npm run preview -- --host 0.0.0.0
```

#### Phase 3: Testing
```bash
# Dev server for testing
docker exec meeting-bingo-dev npm run dev -- --host 0.0.0.0

# Open http://localhost:5173 and run test checklist
```

#### Phase 4-5: Vercel Deploy
```bash
# Create vercel.json (see IMPLEMENTATION_PLAN.md)

# Commit changes
git add -A
git commit -m "feat: Complete Meeting Bingo implementation"

# Deploy to Vercel
npx vercel --prod
```

## Agent Quick Reference

| Task | Agent | Command |
|------|-------|---------|
| Fix TypeScript errors | `coder` | `npm run typecheck` |
| Fix lint issues | `coder` | `npm run lint -- --fix` |
| Build production | `coder` | `npm run build` |
| Run tests | `tester` | Manual checklist |
| Deploy | `cicd-engineer` | `vercel --prod` |

## Troubleshooting

### Docker not running
```bash
open -a Docker
# Wait for Docker icon to stabilize
```

### Port 5173 in use
```bash
lsof -i :5173
kill -9 <PID>
```

### TypeScript errors
```bash
docker exec meeting-bingo-dev npm run typecheck 2>&1 | head -50
# Fix reported errors
```

### Build fails
```bash
docker exec meeting-bingo-dev npm run build 2>&1
# Check error output
```
