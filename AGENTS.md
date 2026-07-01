# Global Rules (imported from OpenCode AGENTS.md)

## Conversation Init Skills

Load the `using-superpowers` skill on the first interaction of every chat

## Persistent Skills

Load the `full-output-enforcement` skill on every session. Use the skill tool to load it at the start of each conversation. It overrides default LLM truncation behavior, enforces complete code generation, bans placeholder patterns, and handles token-limit splits cleanly.
Load the `executing-plans` when having a task or a plan then continue with user defined mode

## Mode Focus Rule

When a mode is called, focus exclusively on that mode's skills and objectives. Do not keep previously loaded skills or modes active. You may load additional skills from other modes only if they are directly relevant to the current task, but default to staying within the called mode's scope.

## TODO Tracking

After completing any TODO item, update `TODO.md` (mark fixed items with `[x]`, add note with date) and list the current TODO status and user modes to the user.

## UI Polish Mode

When the user says "UI polish mode" or "call UI polish mode", load the `ui-ux-pro-max`, `high-end-visual-design`, `industrial-brutalist-ui`, and `impeccable` skills for premium UI/UX design, typography, spacing, animation, Swiss typographic print, military terminal aesthetics, and active polish work (micro-interactions, motion, UX refinement, edge cases).

## UI Init Mode

When the user says "UI init mode" or "call UI init mode", load the `design-system`, `brainstorming`, `design-taste-frontend`, and `minimalist-ui` skills for design setup, token architecture, component specifications, anti-slop frontend design, and minimalist editorial design direction.

## Backend Mode

When the user says "Backend mode" or "call Backend mode", load the `backend-development`, `supabase`, and `supabase-postgres-best-practices` skills for backend systems, APIs, data models, Supabase (database, auth, Edge Functions, Realtime, Storage, RLS, migrations), and Postgres performance optimization.

## Interview Mode

When the user says "Interview mode" or "call Interview mode", load the `prd-generator`, `content-brief-generator`, `design-brief-generator`, `research`, `research-add-fields`, `research-add-items`, `research-deep`, and `research-report` skills for Product Requirements Documents, content briefs, design briefs, and multi-stage research workflows.

## Parallel Execution

When the user says "read the entire codebase", "explore everything", "audit all files", or any task that can be split into independent units of work, spin up multiple sub-agents in parallel. Do not do large explorations or audits sequentially — fan out with concurrent sub-agents for maximum productivity. Each sub-agent handles one independent slice (e.g., one directory, one concern), and you collect their results into the final response.

## Bug Fix Mode

When the user says "Bug fix mode" or "call Bug fix mode", load the `systematic-debugging`, `impeccable`, `ui-styling`, `supabase`, `supabase-postgres-best-practices`, and `design-taste-frontend` skills for fixing P0-P3 bugs including CSS variable fixes, portfolio generator UX, inline styles extraction, certificate pagination, and production-ready login.

## Feature Mode

When the user says "Feature mode" or "call Feature mode", load the `brainstorming`, `writing-plans`, `executing-plans`, `test-driven-development`, `agent-elements`, `slides`, and `image-to-code` skills for full workflow new feature development, tests, AI assistant chat, slide generation, and visual-first redesigns.

## Quality Mode

When the user says "Quality mode" or "call Quality mode", load the `dispatching-parallel-agents`, `requesting-code-review`, `verification-before-completion`, and `finishing-a-development-branch` skills for parallel fixes, code review, verification, and branch cleanup.

## Workflow

1. **Interview mode** → research, PRD, content/design briefs (deliverables to user)
2. **UI Init mode** → design tokens, component specs, design direction (hand off to Feature)
3. **Backend mode** → APIs, database, auth, storage (hand off to Quality)
4. **Feature mode** → brainstorm → plan → TDD → build (hand off to Quality)
5. **UI Polish mode** → high-end styling, animations, polish (hand off to Quality)
6. **Bug Fix mode** → systematic debugging → fix root cause → style/applied fix (hand off to Quality)
7. **Quality mode** → parallel fixes, code review, verification, branch cleanup (terminal)

---

*Imported from `~/.config/opencode/AGENTS.md` on 2026-06-30.*
*In Claude Code, all installed skills are available at session start via the Skill tool. These mode triggers serve as quick-routing conventions — say the trigger phrase and I'll load the corresponding skills.*
