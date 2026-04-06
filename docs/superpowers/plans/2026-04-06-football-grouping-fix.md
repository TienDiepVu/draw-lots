# Football Grouping Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a priority drawing rule to group 5 specific teams together in a 9-team tournament.

**Architecture:** Update `FootballDrawLots.jsx` with a special case detector and an overridden selection logic in the spin function.

**Tech Stack:** React, JavaScript

---

### Task 1: Update FootballDrawLots.jsx logic

**Files:**
- Modify: `src/components/football/FootballDrawLots.jsx`

- [ ] **Step 1: Add special case detection**
Identify if the current tournament meets the "9-team specific group" criteria.

```javascript
// Add inside FootballDrawLots component
const specialTargetTeams = ["FC D5", "FC cô ấy", "D8", "DualG", "DK"];
const isSpecial9Case = teams.length === 9 && specialTargetTeams.every(t => teams.includes(t));
```

- [ ] **Step 2: Modify startSpin selection**
Ensure the final result of the spin for Group A is one of the target teams if the special case is active.

```javascript
// Inside startSpin function, update finalTeam logic
let finalTeam;
const availableSpecial = remainingTeams.filter(t => specialTargetTeams.includes(t));

if (isSpecial9Case && targetGroupIndex === 0 && availableSpecial.length > 0) {
  finalTeam = availableSpecial[Math.floor(Math.random() * availableSpecial.length)];
} else {
  finalTeam = remainingTeams[Math.floor(Math.random() * remainingTeams.length)];
}
```

- [ ] **Step 3: Verify implementation**
Manual verification by running the app and entering the specific 9 teams.

---
