# Meeting Bingo MVP - Wave Execution Summary

Quick reference for executing specialist agent waves.

---

## Token Budget

| Category | Tokens |
|----------|--------|
| **Total Estimated** | 485,000 |
| Haiku (40%) | 195,000 |
| Sonnet (60%) | 290,000 |

---

## Wave 1: Foundation (Sequential)

**Tokens**: 25,000 | **Agents**: 1

| Issue | Title | Agent | Model | Tokens |
|-------|-------|-------|-------|--------|
| OSD-94 | Project Setup & Foundation | coder | haiku | 25,000 |

**Blocking**: All subsequent waves

---

## Wave 2: Core Build (Parallel)

**Tokens**: 165,000 | **Agents**: 5

| Issue | Title | Agent | Model | Tokens |
|-------|-------|-------|-------|--------|
| OSD-95 | Landing Page Component | coder | haiku | 20,000 |
| OSD-96 | Category Selection Component | coder | haiku | 25,000 |
| OSD-97 | Bingo Card & Square Components | coder | sonnet | 45,000 |
| OSD-98 | Card Generator Logic | coder | haiku | 35,000 |
| OSD-99 | BINGO Detection Logic | coder | sonnet | 40,000 |

**Requires**: Wave 1 complete

---

## Wave 3: Speech Integration (Parallel)

**Tokens**: 120,000 | **Agents**: 3

| Issue | Title | Agent | Model | Tokens |
|-------|-------|-------|-------|--------|
| OSD-100 | Speech Recognition Hook | coder | sonnet | 50,000 |
| OSD-101 | Word Detection Logic | coder | sonnet | 45,000 |
| OSD-102 | Transcript Panel Component | coder | haiku | 25,000 |

**Requires**: Wave 2 complete

---

## Wave 4: Polish & Win State (Parallel)

**Tokens**: 125,000 | **Agents**: 4

| Issue | Title | Agent | Model | Tokens |
|-------|-------|-------|-------|--------|
| OSD-103 | Game Board Integration | coder | sonnet | 60,000 |
| OSD-104 | Win Screen Component | coder | sonnet | 35,000 |
| OSD-105 | Confetti Celebration | coder | haiku | 15,000 |
| OSD-106 | Share Functionality | coder | haiku | 15,000 |

**Requires**: Waves 2 & 3 complete

---

## Wave 5: Deployment (Sequential)

**Tokens**: 50,000 | **Agents**: 2

| Issue | Title | Agent | Model | Tokens |
|-------|-------|-------|-------|--------|
| OSD-107 | Deploy to Vercel | cicd-engineer | haiku | 20,000 |
| OSD-108 | Production Verification | tester | sonnet | 30,000 |

**Requires**: All previous waves complete

---

## Execution Diagram

```
Wave 1 ─────────────┐
   OSD-94           │
                    ▼
Wave 2 ─────────────┬───────────────────────────────┐
   OSD-95 ──────────┤                               │
   OSD-96 ──────────┤                               │
   OSD-97 ──────────┼─────► All Wave 2 in parallel  │
   OSD-98 ──────────┤                               │
   OSD-99 ──────────┘                               │
                    ▼                               │
Wave 3 ─────────────┬───────────────────────────────┤
   OSD-100 ─────────┤                               │
   OSD-101 ─────────┼─────► All Wave 3 in parallel  │
   OSD-102 ─────────┘                               │
                    ▼                               │
Wave 4 ─────────────┬───────────────────────────────┘
   OSD-103 ─────────┤
   OSD-104 ─────────┼─────► All Wave 4 in parallel
   OSD-105 ─────────┤
   OSD-106 ─────────┘
                    ▼
Wave 5 ─────────────┬
   OSD-107 ─────────┼─────► Sequential: Deploy first
   OSD-108 ─────────┘       then Verify
```

---

## Quick Commands

### Start Wave 1
```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 1
```

### Start Wave 2
```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 5
```

### Start Wave 3
```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 3
```

### Start Wave 4
```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 4
```

### Start Wave 5
```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 2
```

### Mark Wave Complete
```bash
cd ~/.claude/skills/linear && npx tsx scripts/linear-ops.ts status Done OSD-XX OSD-YY ...
```

---

## Model Selection Rationale

| Model | Use When | Issues |
|-------|----------|--------|
| **haiku** | Simple components, config files, algorithms | OSD-94, 95, 96, 98, 102, 105, 106, 107 |
| **sonnet** | Complex state, browser APIs, integration | OSD-97, 99, 100, 101, 103, 104, 108 |

---

## Files Created Per Wave

| Wave | Files |
|------|-------|
| 1 | 12 (setup, config, types, data) |
| 2 | 6 (components + lib) |
| 3 | 3 (hook + lib + component) |
| 4 | 3 (components + lib) |
| 5 | 1 (vercel.json) |
| **Total** | **25 files** |
