# Meeting Bingo MVP - Execution Plan

**Project**: Meeting Bingo MVP - Wesley
**Linear URL**: https://linear.app/openspace/project/meeting-bingo-mvp-wesley-3b9f9c736fdd
**Total Issues**: 15
**Estimated Total Tokens**: ~485,000 tokens
**Execution Waves**: 5

---

## Executive Summary

This execution plan organizes the Meeting Bingo MVP implementation into 5 waves of specialist agents. Each wave maximizes parallelism while respecting dependencies. Token estimates are based on code complexity, file count, and integration requirements.

### Wave Overview

| Wave | Name | Issues | Parallel Agents | Est. Tokens | Cumulative |
|------|------|--------|-----------------|-------------|------------|
| 1 | Foundation | 1 | 1 | 25,000 | 25,000 |
| 2 | Core Build | 5 | 5 | 165,000 | 190,000 |
| 3 | Speech Integration | 3 | 3 | 120,000 | 310,000 |
| 4 | Polish & Win State | 4 | 4 | 125,000 | 435,000 |
| 5 | Deployment | 2 | 2 | 50,000 | 485,000 |

---

## Wave 1: Foundation

**Objective**: Initialize project with all dependencies and configuration.
**Blocking**: All subsequent waves depend on Wave 1 completion.
**Parallel Agents**: 1 (sequential requirement)

### Agent Assignment

| Issue | Agent Type | Model | Est. Tokens | Files Created |
|-------|------------|-------|-------------|---------------|
| OSD-94 | `coder` | haiku | 25,000 | 12 |

### OSD-94: Project Setup & Foundation

**Agent**: `coder`
**Model**: `haiku` (simple, well-defined tasks)
**Token Estimate**: 25,000

**Rationale**: Project initialization is deterministic with clear commands. Haiku is sufficient for running npm commands and creating boilerplate config files.

**Tasks**:
1. Create Vite project structure
2. Install dependencies (canvas-confetti, tailwindcss, postcss, autoprefixer)
3. Configure Tailwind CSS
4. Create directory structure
5. Create TypeScript type definitions (`src/types/index.ts`)
6. Create buzzword category data (`src/data/categories.ts`)

**Token Breakdown**:
- Vite setup + npm install: 3,000
- Tailwind configuration: 4,000
- Type definitions: 8,000
- Category data (140+ words): 10,000

**Success Criteria**:
- `npm run build` exits 0
- `npm run typecheck` exits 0
- All directories created
- Category data has 40+ words per category

**Files Created**:
```
src/types/index.ts
src/data/categories.ts
tailwind.config.js
postcss.config.js
tsconfig.json
vite.config.ts
index.html
src/main.tsx
src/App.tsx
src/index.css
src/lib/utils.ts
.gitignore
```

---

## Wave 2: Core Build

**Objective**: Build all UI components and core game logic.
**Dependencies**: Wave 1 complete
**Parallel Agents**: 5 (fully parallel)

### Agent Assignment

| Issue | Agent Type | Model | Est. Tokens | Files Created |
|-------|------------|-------|-------------|---------------|
| OSD-95 | `coder` | haiku | 20,000 | 1 |
| OSD-96 | `coder` | haiku | 25,000 | 1 |
| OSD-97 | `coder` | sonnet | 45,000 | 2 |
| OSD-98 | `coder` | haiku | 35,000 | 1 |
| OSD-99 | `coder` | sonnet | 40,000 | 1 |

**Wave 2 Total**: 165,000 tokens

---

### OSD-95: Landing Page Component

**Agent**: `coder`
**Model**: `haiku` (straightforward UI component)
**Token Estimate**: 20,000

**Rationale**: Simple presentational component with no complex logic. Static content with one callback prop.

**Tasks**:
1. Create `LandingPage.tsx` component
2. Implement responsive layout with Tailwind
3. Add "How It Works" section
4. Style "New Game" button
5. Add privacy notice

**Token Breakdown**:
- Component structure: 5,000
- Tailwind styling: 8,000
- Responsive adjustments: 5,000
- Polish/refinement: 2,000

**Files Created**:
```
src/components/LandingPage.tsx
```

---

### OSD-96: Category Selection Component

**Agent**: `coder`
**Model**: `haiku` (simple grid layout)
**Token Estimate**: 25,000

**Rationale**: Card-based layout with category data mapping. Slightly more complex than landing page due to data iteration.

**Tasks**:
1. Create `CategorySelect.tsx` component
2. Map category data to cards
3. Implement hover/selection states
4. Add sample word previews
5. Style responsive grid

**Token Breakdown**:
- Component structure: 6,000
- Category card mapping: 8,000
- Interactive states: 6,000
- Responsive grid: 5,000

**Files Created**:
```
src/components/CategorySelect.tsx
```

---

### OSD-97: Bingo Card & Square Components

**Agent**: `coder`
**Model**: `sonnet` (complex state management, animations)
**Token Estimate**: 45,000

**Rationale**: Core game components with multiple states (default, filled, auto-filled, winning). Requires careful state management and CSS animations. Sonnet provides better reasoning for edge cases.

**Tasks**:
1. Create `BingoCard.tsx` - 5x5 grid container
2. Create `BingoSquare.tsx` - individual square component
3. Implement all square states (default, filled, free, winning)
4. Add BINGO header letters
5. Implement click handlers
6. Add pulse animation for auto-fill
7. Handle winning line highlighting

**Token Breakdown**:
- BingoCard component: 15,000
- BingoSquare component: 12,000
- State variations: 8,000
- Animations: 5,000
- Accessibility: 5,000

**Files Created**:
```
src/components/BingoCard.tsx
src/components/BingoSquare.tsx
```

---

### OSD-98: Card Generator Logic

**Agent**: `coder`
**Model**: `haiku` (algorithmic, well-defined)
**Token Estimate**: 35,000

**Rationale**: Pure functions with clear algorithms (Fisher-Yates shuffle). No UI concerns. Haiku handles algorithmic code well.

**Tasks**:
1. Create `cardGenerator.ts`
2. Implement Fisher-Yates shuffle
3. Implement `generateCard()` function
4. Handle free space placement at [2][2]
5. Create helper functions
6. Add JSDoc documentation

**Token Breakdown**:
- Shuffle algorithm: 8,000
- Card generation logic: 15,000
- Helper functions: 7,000
- Edge case handling: 5,000

**Files Created**:
```
src/lib/cardGenerator.ts
```

---

### OSD-99: BINGO Detection Logic

**Agent**: `coder`
**Model**: `sonnet` (complex logic, 12 win conditions)
**Token Estimate**: 40,000

**Rationale**: Win detection requires checking 12 different lines (5 rows + 5 columns + 2 diagonals). Sonnet's reasoning helps ensure all edge cases are covered correctly.

**Tasks**:
1. Create `bingoChecker.ts`
2. Implement `checkForBingo()` - main detection
3. Implement row checking (5 rows)
4. Implement column checking (5 columns)
5. Implement diagonal checking (2 diagonals)
6. Implement `countFilled()` for progress
7. Implement `getClosestToWin()` for hints
8. Return winning squares for highlighting

**Token Breakdown**:
- Main detection function: 15,000
- Row/column/diagonal checks: 12,000
- Progress tracking: 5,000
- Closest-to-win hints: 8,000

**Files Created**:
```
src/lib/bingoChecker.ts
```

---

## Wave 3: Speech Integration

**Objective**: Implement Web Speech API integration and word detection.
**Dependencies**: Wave 2 complete (needs types and card structure)
**Parallel Agents**: 3 (fully parallel)

### Agent Assignment

| Issue | Agent Type | Model | Est. Tokens | Files Created |
|-------|------------|-------|-------------|---------------|
| OSD-100 | `coder` | sonnet | 50,000 | 1 |
| OSD-101 | `coder` | sonnet | 45,000 | 1 |
| OSD-102 | `coder` | haiku | 25,000 | 1 |

**Wave 3 Total**: 120,000 tokens

---

### OSD-100: Speech Recognition Hook

**Agent**: `coder`
**Model**: `sonnet` (browser API complexity, error handling)
**Token Estimate**: 50,000

**Rationale**: Web Speech API has browser-specific quirks (webkit prefix, auto-restart behavior, error states). Sonnet's reasoning helps handle edge cases and browser compatibility.

**Tasks**:
1. Create `useSpeechRecognition.ts` hook
2. Handle browser feature detection
3. Configure continuous listening mode
4. Manage interim vs final transcripts
5. Implement auto-restart on unexpected stop
6. Handle permission errors gracefully
7. Provide start/stop/reset controls

**Token Breakdown**:
- Hook structure: 10,000
- Web Speech API integration: 15,000
- Auto-restart logic: 10,000
- Error handling: 10,000
- Browser compatibility: 5,000

**Files Created**:
```
src/hooks/useSpeechRecognition.ts
```

---

### OSD-101: Word Detection Logic

**Agent**: `coder`
**Model**: `sonnet` (regex complexity, alias handling)
**Token Estimate**: 45,000

**Rationale**: Word matching requires careful regex construction for word boundaries and multi-word phrases. Alias system adds complexity. Sonnet ensures accurate matching.

**Tasks**:
1. Create `wordDetector.ts`
2. Implement `detectWords()` main function
3. Handle single-word matching with boundaries
4. Handle multi-word phrase matching
5. Implement word alias system
6. Create `detectWordsWithAliases()` enhanced function
7. Add text normalization utilities

**Token Breakdown**:
- Detection algorithm: 15,000
- Regex word boundaries: 10,000
- Multi-word handling: 8,000
- Alias system: 10,000
- Normalization: 2,000

**Files Created**:
```
src/lib/wordDetector.ts
```

---

### OSD-102: Transcript Panel Component

**Agent**: `coder`
**Model**: `haiku` (simple UI display)
**Token Estimate**: 25,000

**Rationale**: Presentational component that displays transcript and detected words. No complex logic - just rendering props.

**Tasks**:
1. Create `TranscriptPanel.tsx`
2. Implement listening status indicator
3. Display scrolling transcript
4. Show detected words badges
5. Handle empty states
6. Style with Tailwind

**Token Breakdown**:
- Component structure: 8,000
- Status indicator: 4,000
- Transcript display: 6,000
- Detected words: 5,000
- Styling: 2,000

**Files Created**:
```
src/components/TranscriptPanel.tsx
```

---

## Wave 4: Polish & Win State

**Objective**: Build win celebration, sharing, and integrate all components.
**Dependencies**: Waves 2 & 3 complete
**Parallel Agents**: 4 (fully parallel)

### Agent Assignment

| Issue | Agent Type | Model | Est. Tokens | Files Created |
|-------|------------|-------|-------------|---------------|
| OSD-103 | `coder` | sonnet | 60,000 | 2 |
| OSD-104 | `coder` | sonnet | 35,000 | 1 |
| OSD-105 | `coder` | haiku | 15,000 | 0 (inline) |
| OSD-106 | `coder` | haiku | 15,000 | 1 |

**Wave 4 Total**: 125,000 tokens

---

### OSD-103: Game Board Integration

**Agent**: `coder`
**Model**: `sonnet` (complex state orchestration)
**Token Estimate**: 60,000

**Rationale**: This is the integration hub connecting speech recognition, word detection, card state, and BINGO checking. Requires careful state management and effect coordination. Sonnet's reasoning is essential.

**Tasks**:
1. Create `GameBoard.tsx` container
2. Create `GameHeader.tsx` subcomponent
3. Create `GameControls.tsx` subcomponent
4. Wire useSpeechRecognition hook
5. Connect word detection to card state
6. Trigger BINGO check on fills
7. Handle manual toggle vs auto-fill
8. Track detected words history
9. Manage listening state
10. Implement "New Card" functionality

**Token Breakdown**:
- GameBoard container: 20,000
- Subcomponents: 10,000
- State wiring: 15,000
- Effect coordination: 10,000
- Edge cases: 5,000

**Files Created**:
```
src/components/GameBoard.tsx
src/components/GameControls.tsx
```

---

### OSD-104: Win Screen Component

**Agent**: `coder`
**Model**: `sonnet` (stats calculation, responsive layout)
**Token Estimate**: 35,000

**Rationale**: Win screen needs to calculate elapsed time, display stats, show winning card with highlights. Multiple calculations and conditional rendering benefit from Sonnet.

**Tasks**:
1. Create `WinScreen.tsx` component
2. Calculate and display time elapsed
3. Show winning word and line
4. Display completed card with highlights
5. Implement "Play Again" flow
6. Add share button (delegates to shareUtils)
7. Responsive layout for mobile

**Token Breakdown**:
- Component structure: 10,000
- Stats calculations: 8,000
- Card display with highlights: 10,000
- Responsive styling: 5,000
- Button actions: 2,000

**Files Created**:
```
src/components/WinScreen.tsx
```

---

### OSD-105: Confetti Celebration

**Agent**: `coder`
**Model**: `haiku` (simple library integration)
**Token Estimate**: 15,000

**Rationale**: canvas-confetti is a well-documented library. Integration is straightforward - just configure and call.

**Tasks**:
1. Import canvas-confetti
2. Create `celebrate()` function
3. Configure dual-side firing
4. Set 2-second duration
5. Use requestAnimationFrame for smooth animation
6. Add to WinScreen useEffect

**Token Breakdown**:
- Library integration: 5,000
- Animation configuration: 5,000
- Timing/cleanup: 5,000

**Files Created**:
```
(Integrated into WinScreen.tsx or src/lib/celebrate.ts)
```

---

### OSD-106: Share Functionality

**Agent**: `coder`
**Model**: `haiku` (browser API, straightforward)
**Token Estimate**: 15,000

**Rationale**: Clipboard API and Web Share API are well-documented. Logic is straightforward - generate text, copy or share.

**Tasks**:
1. Create `shareUtils.ts`
2. Implement `generateShareText()`
3. Implement `copyToClipboard()`
4. Implement `shareNative()` for mobile
5. Add fallback chain (native → clipboard)
6. Return success/failure for toast

**Token Breakdown**:
- Text generation: 4,000
- Clipboard API: 4,000
- Web Share API: 4,000
- Fallback logic: 3,000

**Files Created**:
```
src/lib/shareUtils.ts
```

---

## Wave 5: Deployment

**Objective**: Deploy to Vercel and verify production functionality.
**Dependencies**: All previous waves complete
**Parallel Agents**: 2 (sequential within wave)

### Agent Assignment

| Issue | Agent Type | Model | Est. Tokens | Files Created |
|-------|------------|-------|-------------|---------------|
| OSD-107 | `cicd-engineer` | haiku | 20,000 | 1 |
| OSD-108 | `tester` | sonnet | 30,000 | 0 |

**Wave 5 Total**: 50,000 tokens

---

### OSD-107: Deploy to Vercel

**Agent**: `cicd-engineer`
**Model**: `haiku` (CLI commands, config files)
**Token Estimate**: 20,000

**Rationale**: Deployment is command-driven with a simple config file. Haiku handles this well.

**Tasks**:
1. Create `vercel.json` configuration
2. Run production build verification
3. Execute Vercel CLI deployment
4. Verify deployment URL accessible
5. Check HTTPS and SSL

**Token Breakdown**:
- Config creation: 5,000
- Build verification: 5,000
- Deployment commands: 5,000
- Verification: 5,000

**Files Created**:
```
vercel.json
```

---

### OSD-108: Production Verification

**Agent**: `tester`
**Model**: `sonnet` (comprehensive testing, edge cases)
**Token Estimate**: 30,000

**Rationale**: Production verification requires systematic testing across browsers and devices. Sonnet's reasoning helps ensure comprehensive coverage.

**Tasks**:
1. Verify HTTPS/SSL
2. Test all screen flows
3. Test microphone permissions
4. Verify speech recognition
5. Test BINGO detection
6. Test share functionality
7. Mobile testing
8. Cross-browser verification (Chrome, Safari, Edge)
9. Document any issues

**Token Breakdown**:
- Basic access tests: 5,000
- Screen flow tests: 8,000
- Speech tests: 8,000
- Mobile/cross-browser: 7,000
- Documentation: 2,000

**Files Created**:
```
(Test results documented in Linear issue)
```

---

## Execution Commands

### Wave 1 Execution

```bash
# Initialize swarm with anti-drift topology
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 1 --strategy specialized

# Execute Wave 1
Task({
  prompt: "Execute OSD-94: Project Setup & Foundation. Create Vite project, install dependencies, configure Tailwind, create type definitions and category data. Verify build succeeds.",
  subagent_type: "coder",
  model: "haiku",
  description: "Wave 1: Foundation",
  run_in_background: true
})
```

### Wave 2 Execution (Parallel)

```bash
# Initialize swarm for parallel execution
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 5 --strategy specialized

# Execute all Wave 2 issues in parallel
Task({ prompt: "Execute OSD-95: Create LandingPage.tsx...", subagent_type: "coder", model: "haiku", run_in_background: true })
Task({ prompt: "Execute OSD-96: Create CategorySelect.tsx...", subagent_type: "coder", model: "haiku", run_in_background: true })
Task({ prompt: "Execute OSD-97: Create BingoCard.tsx and BingoSquare.tsx...", subagent_type: "coder", model: "sonnet", run_in_background: true })
Task({ prompt: "Execute OSD-98: Create cardGenerator.ts...", subagent_type: "coder", model: "haiku", run_in_background: true })
Task({ prompt: "Execute OSD-99: Create bingoChecker.ts...", subagent_type: "coder", model: "sonnet", run_in_background: true })
```

### Wave 3 Execution (Parallel)

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 3 --strategy specialized

Task({ prompt: "Execute OSD-100: Create useSpeechRecognition.ts...", subagent_type: "coder", model: "sonnet", run_in_background: true })
Task({ prompt: "Execute OSD-101: Create wordDetector.ts...", subagent_type: "coder", model: "sonnet", run_in_background: true })
Task({ prompt: "Execute OSD-102: Create TranscriptPanel.tsx...", subagent_type: "coder", model: "haiku", run_in_background: true })
```

### Wave 4 Execution (Parallel)

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 4 --strategy specialized

Task({ prompt: "Execute OSD-103: Create GameBoard.tsx integration...", subagent_type: "coder", model: "sonnet", run_in_background: true })
Task({ prompt: "Execute OSD-104: Create WinScreen.tsx...", subagent_type: "coder", model: "sonnet", run_in_background: true })
Task({ prompt: "Execute OSD-105: Implement confetti celebration...", subagent_type: "coder", model: "haiku", run_in_background: true })
Task({ prompt: "Execute OSD-106: Create shareUtils.ts...", subagent_type: "coder", model: "haiku", run_in_background: true })
```

### Wave 5 Execution (Sequential)

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 2 --strategy specialized

# Deploy first
Task({ prompt: "Execute OSD-107: Deploy to Vercel...", subagent_type: "cicd-engineer", model: "haiku", run_in_background: true })

# Then verify (after deploy completes)
Task({ prompt: "Execute OSD-108: Production Verification...", subagent_type: "tester", model: "sonnet", run_in_background: true })
```

---

## Token Budget Summary

### By Model

| Model | Issues | Total Tokens | % of Total |
|-------|--------|--------------|------------|
| haiku | 9 | 195,000 | 40% |
| sonnet | 6 | 290,000 | 60% |
| **Total** | **15** | **485,000** | **100%** |

### By Wave

| Wave | Issues | Tokens | Parallel | Max Concurrent |
|------|--------|--------|----------|----------------|
| 1 | 1 | 25,000 | No | 1 |
| 2 | 5 | 165,000 | Yes | 5 |
| 3 | 3 | 120,000 | Yes | 3 |
| 4 | 4 | 125,000 | Yes | 4 |
| 5 | 2 | 50,000 | Partial | 2 |

### By Agent Type

| Agent | Issues | Tokens |
|-------|--------|--------|
| coder | 13 | 435,000 |
| cicd-engineer | 1 | 20,000 |
| tester | 1 | 30,000 |

---

## Risk Mitigation

### Token Overrun

If a task exceeds estimated tokens:
1. **Haiku tasks**: Allow 50% buffer before escalating to Sonnet
2. **Sonnet tasks**: Allow 30% buffer, then split into sub-tasks
3. **Maximum retry**: 2 attempts before human review

### Dependency Failures

If a wave fails:
1. Stop dependent waves
2. Debug and fix failed task
3. Re-run failed task only (not entire wave)
4. Resume dependent waves

### Integration Issues

Wave 4 (OSD-103) is the highest risk due to integration complexity:
1. Run after Waves 2 & 3 are verified working
2. Allow extra 20% token buffer
3. Consider splitting into multiple passes if needed

---

## Linear Status Updates

After each wave completion:

```bash
# Mark issues as Done
npx tsx ~/.claude/skills/linear/scripts/linear-ops.ts status Done OSD-94 OSD-95 ...

# Update project status on final wave
npx tsx ~/.claude/skills/linear/scripts/linear-ops.ts project-status "Meeting Bingo MVP - Wesley" completed
```

---

## Appendix: File Manifest

### Final Project Structure

```
meeting-bingo/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── postcss.config.js
├── vercel.json
├── .gitignore
│
├── public/
│   └── favicon.svg
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    │
    ├── components/
    │   ├── LandingPage.tsx
    │   ├── CategorySelect.tsx
    │   ├── GameBoard.tsx
    │   ├── GameControls.tsx
    │   ├── BingoCard.tsx
    │   ├── BingoSquare.tsx
    │   ├── TranscriptPanel.tsx
    │   └── WinScreen.tsx
    │
    ├── hooks/
    │   └── useSpeechRecognition.ts
    │
    ├── lib/
    │   ├── utils.ts
    │   ├── cardGenerator.ts
    │   ├── bingoChecker.ts
    │   ├── wordDetector.ts
    │   └── shareUtils.ts
    │
    ├── data/
    │   └── categories.ts
    │
    └── types/
        └── index.ts
```

**Total Files**: 24
**Total Estimated Tokens**: 485,000
