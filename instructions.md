# NEVER EVER post api keys, tokens, or secrets to the remote repository, use .env and supabase edge function secrets, vite in Vercel

# Do not attribute Claude as co-author

Let's build the MVP milestone of this project by first creating a to the @project_spec.json doc, if that doc does not exist, create it. Make an implementation plan first and then use parallel subagents where possible to speed up implementation by developing in parallel.

## When committing code, run /update-docs-and-commit to update docs, notes and then run feature-dev:code-reviewer agent to review code and conflicts before pushing.

## Documentation

- [Project Spec](project_spec.json) – Full requirements, Feature descriptions, API specs, tech details
- [Architecture](docs/architecture.md) – System design and data flow
- [Changelog](docs/changelog.md) – Version history
- [Project Status](docs/project_status.md) – Current progress
- Update files in the docs folder after major milestones and major additions to the project.
- Use the /update-docs-and-commit slash command when making git commits

Plugins

- frontend-design anthropic
- feature-dev anthropic
- compound-engineering @ every-marketplace
- GitHub cli
- agent-browser 

MCP

- Supabase
- Playwright
- Vercel
- Magpipe
- https://github.com/jgravelle/jcodemunch-mcp


Project Spec
- Overview
    - Describe the project, who its for, what problems are you solving, what the product will do and how it will function. Is this a mobile app or a web application and PWA?
- Milestones
    - Break down your project into Milestones
        - Tech stack
            - Describe the stack you will be using, Supabase, Vercel, NextJS Single Page App or Multi page app.
            - Describe your domains, eg. App.domain for the app, API.domain for the apis, etc.
            - APIs, describe your external APIs that you will be using
        - Features
            - Describe your features as they should be used by the user
        - Subagents jobs to be done
            - Describe what each subagent should be doing in this milestone

---

Subagents
Put in /agents

- Changelog subagent
    - Name: changelog-updater
    - Des: Update changelog entries when features re completed or changes are made to the project. Use after completing a feature fixing bugs or making significant changes.
    - Tools: Read, Write, Edit, Bash(git:*)
    - Model: Opus
- Front-end testing subagent
    - Name: frontend-tester
    - Des: Runs Playwright tests for the frontend functionality and reports results. Auto detects playwright setup and offers to initialize if missing.
    - Tools: Read, Write, Edit, Bash(npm:*), Bash(npx:*), Glob, Grep
    - Model: Opus
- Retro-agent
    - Name: retro-agent
    - Des: Run a retrospective audit on our coding session and update Claude with findings for efficiency and architecture.
    - Tools: Read, Write, Edit, Bash(npm:*), Bash(npx:*), Glob, Grep
    - Model: Opus

Slash Commands

- /feature-dev : Guided feature development with codebase understanding and architecture focus
- /update-docs-commit (custom) : Update Architecture.md and Changelog.md with the changes made in this commit
- /create-issues : Create issues for milestone 2 and 3 from project-spec.md and label them accordingly (feature, minor enhancement, bug fix, etc)

The /update-docs-and-commit slash command now includes instructions to
  update CLAUDE.md when there are relevant changes to:
  - Project architecture or file structure
  - New commands or scripts
  - New environment variables
  - New components or API endpoints
  - Custom subagents or slash commands
  - Known issues
  - Testing procedures