# Football Grouping Strategy Design

**Date:** 2026-04-06
**Status:** Approved
**Topic:** Forced grouping for specific teams in 9-team scenarios

## Context
The user wants to ensure that 5 specific teams (FC D5, FC cô ấy, D8, DualG, DK) are always placed in the same group when a 9-team tournament is registered. The current system uses a random drawing mechanism with an optional seeding phase.

## Requirements
- **Trigger Condition:** Exactly 9 teams in total.
- **Target Teams:** `FC D5`, `FC cô ấy`, `D8`, `DualG`, `DK`.
- **Behavior:** These 5 teams must end up in the first group (Group A).
- **User Experience:** The "Spinning" animation must still occur, and the names should appear random during the spin, but the final selection for Group A slots must be one of the target teams until they are all assigned.

## Proposed Architecture
We will modify `FootballDrawLots.jsx` to include a "Special Case" detection logic.

### 1. Detection
At the component level, we check:
```javascript
const specialTeams = ["FC D5", "FC cô ấy", "D8", "DualG", "DK"];
const isSpecialCase = teams.length === 9 && specialTeams.every(name => teams.includes(name));
```

### 2. Draw Logic Override
In the `startSpin` function, we modify the selection of the `finalTeam`:
- If `isSpecialCase` is true AND `targetGroupIndex` is 0 (Group A).
- Filter `remainingTeams` to find those that are in `specialTeams`.
- Randomly pick one from this filtered list as the `finalTeam`.
- Otherwise, use the standard random selection from all `remainingTeams`.

## Verification Plan
1. Start the app.
2. Enter exactly 9 teams: `FC D5`, `FC GITS`, `D12 All in one`, `D8`, `D11`, `FC cô ấy`, `Đê vội`, `DK`, `DualG`.
3. Proceed to the Drawing phase.
4. Verify that all slots in Group A are filled by the 5 target teams.
5. Verify that the remaining 4 teams are placed in Group B.
