# Meeting Bingo - Claude-Flow Execution Plan

**Version**: 2.0
**Status**: Ready for Swarm Execution
**Workflow**: Local Docker Build → Vercel Deployment

---

## Swarm Configuration

```bash
# Initialize hierarchical swarm for controlled execution
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 6 --strategy specialized
```

---

## Phase 1: Docker Environment Setup

**Blocking**: Must complete before any other phase

### Task 1.1: Verify Docker Running
**Agent**: `coder`
**Model**: `haiku`

```yaml
task:
  name: verify-docker
  description: Ensure Docker Desktop is running and accessible
  commands:
    - docker --version
    - docker compose version
  success_criteria:
    - Docker CLI responds
    - docker compose available
  on_failure:
    - action: notify_user
      message: "Please start Docker Desktop: open -a Docker"
```

### Task 1.2: Build Development Container
**Agent**: `coder`
**Model**: `haiku`
**Depends**: Task 1.1

```yaml
task:
  name: build-container
  description: Build and start the development container
  commands:
    - docker compose --profile dev up -d --build
    - docker ps --filter "name=meeting-bingo-dev" --format "{{.Status}}"
  success_criteria:
    - Container status shows "Up"
    - No build errors
  timeout: 180s
```

### Task 1.3: Install Dependencies
**Agent**: `coder`
**Model**: `haiku`
**Depends**: Task 1.2

```yaml
task:
  name: install-deps
  description: Install npm dependencies inside container
  commands:
    - docker exec meeting-bingo-dev npm install
  success_criteria:
    - Exit code 0
    - No npm ERR! messages
  timeout: 120s
```

---

## Phase 2: Code Validation

**Blocking**: Must pass before build

### Task 2.1: TypeScript Compilation
**Agent**: `reviewer`
**Model**: `haiku`
**Depends**: Task 1.3

```yaml
task:
  name: typecheck
  description: Verify TypeScript compiles without errors
  commands:
    - docker exec meeting-bingo-dev npm run typecheck
  success_criteria:
    - Exit code 0
    - No type errors
  on_failure:
    - action: spawn_agent
      agent: coder
      task: fix-typescript-errors
```

### Task 2.2: Fix TypeScript Errors (Conditional)
**Agent**: `coder`
**Model**: `sonnet`
**Trigger**: Task 2.1 fails

```yaml
task:
  name: fix-typescript-errors
  description: Fix any TypeScript compilation errors
  steps:
    - Run typecheck and capture errors
    - Read affected files
    - Fix type issues (missing imports, type mismatches)
    - Re-run typecheck to verify
  success_criteria:
    - npm run typecheck passes
```

### Task 2.3: Lint Check
**Agent**: `reviewer`
**Model**: `haiku`
**Depends**: Task 2.1

```yaml
task:
  name: lint-check
  description: Run ESLint and fix auto-fixable issues
  commands:
    - docker exec meeting-bingo-dev npm run lint -- --fix
  success_criteria:
    - No critical errors
    - Warnings acceptable
```

### Task 2.4: Verify Project Structure
**Agent**: `reviewer`
**Model**: `haiku`
**Depends**: Task 1.3

```yaml
task:
  name: verify-structure
  description: Ensure all required files exist
  required_files:
    config:
      - index.html
      - package.json
      - tsconfig.json
      - vite.config.ts
      - tailwind.config.js
      - postcss.config.js
    source:
      - src/main.tsx
      - src/App.tsx
      - src/index.css
    components:
      - src/components/LandingPage.tsx
      - src/components/CategorySelect.tsx
      - src/components/BingoCard.tsx
      - src/components/BingoSquare.tsx
      - src/components/GameBoard.tsx
      - src/components/GameControls.tsx
      - src/components/TranscriptPanel.tsx
      - src/components/WinScreen.tsx
      - src/components/ui/Button.tsx
      - src/components/ui/Card.tsx
      - src/components/ui/Toast.tsx
    hooks:
      - src/hooks/useSpeechRecognition.ts
      - src/hooks/useLocalStorage.ts
      - src/hooks/useGame.ts
    lib:
      - src/lib/cardGenerator.ts
      - src/lib/bingoChecker.ts
      - src/lib/wordDetector.ts
      - src/lib/shareUtils.ts
      - src/lib/utils.ts
    data:
      - src/data/categories.ts
      - src/types/index.ts
  on_missing:
    - action: spawn_agent
      agent: coder
      task: create-missing-files
```

---

## Phase 3: Local Build & Test

### Task 3.1: Production Build
**Agent**: `coder`
**Model**: `haiku`
**Depends**: Phase 2 complete

```yaml
task:
  name: production-build
  description: Create optimized production build
  commands:
    - docker exec meeting-bingo-dev npm run build
  success_criteria:
    - Exit code 0
    - dist/ directory created
    - dist/index.html exists
    - dist/assets/ contains JS and CSS bundles
  output:
    - Build time
    - Bundle sizes
```

### Task 3.2: Preview Production Build
**Agent**: `coder`
**Model**: `haiku`
**Depends**: Task 3.1

```yaml
task:
  name: preview-build
  description: Start preview server for production build
  commands:
    - docker exec -d meeting-bingo-dev npm run preview -- --host 0.0.0.0 --port 4173
  success_criteria:
    - Server starts on port 4173
    - http://localhost:4173 accessible
```

### Task 3.3: Functional Testing
**Agent**: `tester`
**Model**: `sonnet`
**Depends**: Task 3.2

```yaml
task:
  name: functional-test
  description: Verify all features work correctly
  test_checklist:
    landing_page:
      - Page loads without console errors
      - "MEETING BINGO" title displays
      - "NEW GAME" button clickable
      - Privacy message visible
      - "How It Works" section shows 4 steps

    category_selection:
      - 3 categories display (Agile 🏃, Corporate 💼, Tech 💻)
      - Each shows name, description, sample words
      - Clicking category transitions to game
      - Back button returns to landing

    game_board:
      - 5x5 grid renders correctly
      - Center square shows "FREE" (pre-filled)
      - 24 unique buzzwords displayed
      - Progress shows "1/24 squares"
      - Listening indicator present

    manual_gameplay:
      - Clicking square toggles filled state
      - Filled squares show blue background
      - Progress counter updates
      - Near-bingo shows "One away!" indicator
      - BINGO triggers on 5-in-a-row

    win_screen:
      - Confetti animation plays
      - "BINGO!" title displays
      - Winning line highlighted green
      - Stats show (time, winning word, squares)
      - Share button functional
      - Play Again returns to categories

    speech_recognition:
      - Note: Requires HTTPS in production
      - In development: manual testing only

  success_criteria:
    - All landing_page tests pass
    - All category_selection tests pass
    - All game_board tests pass
    - All manual_gameplay tests pass
    - All win_screen tests pass
```

---

## Phase 4: Vercel Configuration

### Task 4.1: Create Vercel Config
**Agent**: `cicd-engineer`
**Model**: `haiku`
**Depends**: Phase 3 complete

```yaml
task:
  name: create-vercel-config
  description: Create vercel.json for deployment
  file: /vercel.json
  content: |
    {
      "$schema": "https://openapi.vercel.sh/vercel.json",
      "buildCommand": "npm run build",
      "outputDirectory": "dist",
      "installCommand": "npm install",
      "framework": "vite",
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ],
      "headers": [
        {
          "source": "/(.*)",
          "headers": [
            { "key": "X-Content-Type-Options", "value": "nosniff" },
            { "key": "X-Frame-Options", "value": "DENY" }
          ]
        }
      ]
    }
```

### Task 4.2: Update .gitignore
**Agent**: `cicd-engineer`
**Model**: `haiku`
**Depends**: Task 4.1

```yaml
task:
  name: update-gitignore
  description: Ensure deployment artifacts are ignored
  ensure_ignored:
    - node_modules/
    - dist/
    - .env
    - .env.local
    - .env.*.local
    - .vercel/
    - "*.log"
```

### Task 4.3: Git Commit
**Agent**: `cicd-engineer`
**Model**: `haiku`
**Depends**: Task 4.2

```yaml
task:
  name: git-commit
  description: Commit all changes for deployment
  commands:
    - git add -A
    - |
      git commit -m "feat: Complete Meeting Bingo implementation

      Features:
      - React 18 + TypeScript + Vite + Tailwind CSS
      - Web Speech API for live audio transcription
      - 3 buzzword categories (Agile, Corporate, Tech)
      - Auto-fill squares on word detection
      - BINGO detection (rows, columns, diagonals)
      - Near-bingo tension indicator
      - Confetti celebration on win
      - Share functionality with clipboard/native share
      - Responsive design for mobile/tablet/desktop

      Technical:
      - Docker development environment
      - Vercel deployment configuration
      - TypeScript strict mode
      - ESLint configured

      Co-Authored-By: claude-flow <ruv@ruv.net>"
  success_criteria:
    - Commit created successfully
```

---

## Phase 5: Vercel Deployment

### Task 5.1: Deploy to Vercel
**Agent**: `cicd-engineer`
**Model**: `sonnet`
**Depends**: Task 4.3

```yaml
task:
  name: vercel-deploy
  description: Deploy to Vercel production
  options:
    option_a_cli:
      description: Deploy via Vercel CLI
      commands:
        - npx vercel --prod
      notes: Will prompt for Vercel login if not authenticated

    option_b_github:
      description: Deploy via GitHub integration
      steps:
        - Push to GitHub (git push origin main)
        - Connect repo in Vercel dashboard
        - Vercel auto-deploys on push
      recommended: true

  success_criteria:
    - Deployment completes without errors
    - Production URL provided
```

### Task 5.2: Production Verification
**Agent**: `tester`
**Model**: `sonnet`
**Depends**: Task 5.1

```yaml
task:
  name: production-verify
  description: Verify deployment works correctly
  checks:
    - Site loads over HTTPS
    - No console errors
    - All screens navigate correctly
    - Speech API permission prompt works (HTTPS enables this)
    - Share generates correct production URL
    - Mobile responsive
  success_criteria:
    - All checks pass
    - Site fully functional
```

### Task 5.3: Update Share URL
**Agent**: `coder`
**Model**: `haiku`
**Depends**: Task 5.2

```yaml
task:
  name: update-share-url
  description: Update shareUtils.ts with production URL
  file: src/lib/shareUtils.ts
  update:
    find: "meetingbingo.app"
    replace: "<actual-vercel-url>"
  then:
    - Rebuild: docker exec meeting-bingo-dev npm run build
    - Redeploy: npx vercel --prod
```

---

## Execution Summary

### Agent Allocation

| Phase | Tasks | Primary Agent | Backup Agent |
|-------|-------|---------------|--------------|
| 1. Docker Setup | 1.1-1.3 | `coder` (haiku) | - |
| 2. Validation | 2.1-2.4 | `reviewer` (haiku) | `coder` (sonnet) |
| 3. Build & Test | 3.1-3.3 | `coder`, `tester` | - |
| 4. Vercel Config | 4.1-4.3 | `cicd-engineer` (haiku) | - |
| 5. Deployment | 5.1-5.3 | `cicd-engineer`, `tester` | - |

### Execution Order

```
Phase 1 (Docker) ──┬──> Phase 2 (Validation) ──> Phase 3 (Build/Test)
                   │
                   └──> [Parallel validation tasks]

Phase 3 ──> Phase 4 (Vercel Config) ──> Phase 5 (Deploy)
```

### Swarm Spawn Command

```bash
# Claude Code spawns agents with:
Task({
  prompt: "[task description from yaml above]",
  subagent_type: "[agent type]",
  model: "[haiku|sonnet]",
  run_in_background: true  # For parallel execution
})
```

---

## Quick Manual Execution

If running without swarm:

```bash
# Phase 1: Docker
open -a Docker
docker compose --profile dev up -d --build
docker exec meeting-bingo-dev npm install

# Phase 2: Validate
docker exec meeting-bingo-dev npm run typecheck
docker exec meeting-bingo-dev npm run lint

# Phase 3: Build
docker exec meeting-bingo-dev npm run build

# Phase 4: Vercel config (create vercel.json manually)

# Phase 5: Deploy
git add -A && git commit -m "feat: Meeting Bingo"
npx vercel --prod
```

---

## Rollback Procedures

### Build Failure
```bash
docker exec meeting-bingo-dev npm run typecheck 2>&1 | head -100
# Fix errors, rebuild
```

### Container Issues
```bash
docker compose --profile dev down
docker compose --profile dev up -d --build --force-recreate
```

### Vercel Deployment Failure
```bash
# Check Vercel logs
npx vercel logs

# Rollback to previous deployment
npx vercel rollback
```

---

*Claude-Flow Execution Plan v2.0*
*Target: Meeting Bingo MVP → Vercel Production*
