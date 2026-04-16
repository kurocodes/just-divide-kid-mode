# Just Divide - Kid Mode

## Approach
I built this as a small React game with the game state centered in a reducer and the merge rules kept in pure utility functions. That let me keep the UI components mostly presentational while making the puzzle behavior easier to reason about, especially for chain merges, undo, hints, and game-over checks.

For the UI, I started with a desktop-first playful layout based on the provided direction, then refactored it into smaller style files and added a separate compact/mobile mode instead of relying only on a global scale transform.

## Key Decisions
- I kept the merge logic isolated in `src/utils` so the division behavior is testable and not mixed into React rendering.
- I used `useReducer` instead of a group of `useState` calls because the moves affect many parts of the game at once: grid, queue, keep slot, trash count, score, level, timer state, and undo history.
- I split the project into `components`, `game`, `hooks`, `utils`, and `styles` after the first pass because the initial files grew too large to maintain comfortably.
- For mobile, I introduced a real compact layout rather than only shrinking the desktop board, because pure scaling made the game feel too small and left a lot of wasted space.

## Challenges
- The trickiest part was getting the merge behavior correct when a placed tile could divide, disappear, or continue chaining from the larger neighbor.
- Responsive layout took more iteration than the core game logic. A desktop-sized playfield scaled with CSS looked fine at some sizes, but it caused centering issues, empty space, and poor usability on smaller screens.
- Keeping the board visually stable also needed care. Without explicitly defining equal grid rows, placed tiles could make one row stretch while others collapsed.

## What I Would Improve
- I would add a small test suite around the merge rules and move reducer so future UI changes cannot accidentally break gameplay.
- I would tune the tile generation more carefully over time using real playtesting data, especially around late-game solvability and difficulty balance.
- I would improve the mobile drag experience further with a dedicated touch ghost/target system that feels more native on smaller devices.
- I would add lightweight sound effects and clearer feedback for level-ups, valid drops, and blocked moves.
