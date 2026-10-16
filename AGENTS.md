<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS

- Skin categories, signs, actives, contraindications and base routines live in one fixed guide module that both the category UI and the AI prompt read — keeps scan results and browsable routines consistent.
- AI skin analysis output is normalized against that guide before reaching the UI — the model can return unknown or missing fields.
- Lip care scans share the facial camera but use a separate authenticated server function and strict output schema; they never become skin scans or routine-comparison photos — keeps lip advice separate from skin tracking.
- Lip care steps and safety exclusions live in the lip analysis module and are enforced during normalization as well as supplied to the AI prompt — prevents generated makeup or unsafe volume remedies from reaching the routine.
