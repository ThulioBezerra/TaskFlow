# Generate All User Stories (English)

Goal: Generate a complete set of user stories for all epics,
based on the existing PRD and architecture.

Inputs:
- PRD: docs/prd.md (or docs/prd/*.md)
- Architecture: docs/architecture.md (optional but recommended)
- Epics: docs/epics/*.md (if available) or PRD sections

Steps:

1. Identify Scope
   - Read `docs/prd.md` and `docs/architecture.md`.
   - If `docs/epics/` exists, enumerate all epic files (epic-1-*.md, epic-2-*.md, etc.).
   - If not, infer "epic-level" groupings from the PRD sections.

2. For each epic or major feature area:
   - If epics exist:
     - Open the epic file, understand its goal and constraints.
   - If epics do not exist:
     - Create a temporary epic-level outline from the PRD.

3. Story Generation Loop (ENGLISH ONLY):
   For the current epic / feature area:
   - Use the existing BMAD story creation mechanism:
     - For sharded PRD: behave as Scrum Master and call the `create-next-story` task
       (command: `*draft`) to generate the next story.
     - For brownfield sections: behave as PO/PM and call `*create-story`
       (task `brownfield-create-story`).
   - Ensure every story:
     - Follows the `story-tmpl.yaml` structure.
     - Is saved under `docs/stories/` with the correct numbering scheme
       (e.g., `1.1-xxxx.md`, `1.2-xxxx.md`, `2.1-xxxx.md`).

   - Repeat story creation while:
     - There are still clear user-centric behaviors or flows for this epic
       not yet covered by a story.
   - When remaining requirements feel too vague or overlapping,
     stop and document them in a "Open Questions" section in the epic.

4. Consistency & Gaps:
   - After iterating through all epics / feature areas:
     - Scan the generated `docs/stories/*.md` files.
     - Check for:
       - Overlapping stories.
       - Missing critical flows (happy path, error paths, edge cases).
     - For any gaps, create additional stories or add TODOs in the relevant epic.

5. Output:
   - Produce a summary file `docs/stories/_index.en.md` containing:
     - A list of all generated stories grouped by epic.
     - One-line description per story.
     - A section "Known Gaps / Open Questions" with anything that still needs PO input.
