## 📂 Code Sharing & Git Workflow - DETAILED SETUP

### Repository Structure
- [ ] Create two separate folders in root:
  - `/backend` - Spring Boot project
  - `/frontend` - React project
- [ ] Add comprehensive .gitignore files for both projects

### Branching Strategy
```
main (production-ready code only)
  ├── dev (integration branch - merge here first)
  │    ├── backend-auth (Alejandro's feature branches)
  │    ├── backend-messaging
  │    ├── backend-websocket
  │    ├── frontend-auth (Jane's feature branches)
  │    ├── frontend-chat
  │    ├── frontend-ui
  │    └── integration-testing (Lawrence's testing branch)
```

**Branch Rules:**
- **NEVER commit directly to `main`**
- **NEVER commit directly to `dev`** without testing locally first
- Always work on your own feature branches
- Merge to `dev` first, test, then merge to `main` when stable for demo

### Branch Naming Convention
- Backend features: `backend-<feature-name>` (e.g., `backend-auth`, `backend-websocket`)
- Frontend features: `frontend-<feature-name>` (e.g., `frontend-login`, `frontend-chat`)
- Bug fixes: `fix-<issue-description>` (e.g., `fix-cors-error`)
- Integration: `integration-<description>`

### Git Workflow for Each Developer

#### Step 1: Initial Setup (Do Once)
```bash
# Clone the repository
git clone <repository-url>
cd <project-name>

# Create and switch to dev branch
git checkout -b dev
git push -u origin dev
```

#### Step 2: Starting a New Feature
```bash
# Make sure you're on dev and it's up to date
git checkout dev
git pull origin dev

# Create your feature branch from dev
git checkout -b backend-auth  # or frontend-login, etc.
```

#### Step 3: Working on Your Feature
```bash
# Make changes to your code
# Test locally

# Stage and commit frequently (small, logical commits)
git add .
git commit -m "Add user registration endpoint"

# Push your branch to GitHub (so others can see progress)
git push -u origin backend-auth
```

#### Step 4: Merging Your Feature to Dev
```bash
# Before merging, update your branch with latest dev
git checkout dev
git pull origin dev
git checkout backend-auth
git merge dev

# Resolve any conflicts if they exist
# Test everything still works

# Push updated branch
git push origin backend-auth

# Create Pull Request on GitHub from your branch → dev
# Tag team members for review
# Once approved, merge to dev
```

#### Step 5: Syncing with Others' Changes
```bash
# Do this at start of each work session
git checkout dev
git pull origin dev

# Update your feature branch with latest dev
git checkout your-feature-branch
git merge dev

# Resolve conflicts if any
# Continue working
```

### Pull Request Guidelines

**Creating a PR:**
- Title: `[Backend/Frontend] Brief description` (e.g., `[Backend] Add user authentication`)
- Description should include:
  - What you changed
  - How to test it
  - Any breaking changes
  - Screenshots (for frontend)

**Reviewing a PR:**
- [ ] Code looks clean and understandable
- [ ] No obvious bugs
- [ ] Tested locally if possible
- [ ] Leave comments or approve

**Merging:**
- At least 1 approval required (or waive for demo week if urgent)
- Use "Squash and merge" to keep history clean
- Delete branch after merging

### Daily Sync Process

**End of Each Day:**
1. Commit and push your current work
2. Post in group chat: "Pushed changes to `branch-name`, added X feature"
3. If you merged to `dev`, notify team to pull latest

**Start of Each Day:**
1. Pull latest `dev` branch
2. Merge `dev` into your feature branch
3. Check group chat for any updates or blockers

### Conflict Resolution

**If you get merge conflicts:**
1. Don't panic - conflicts are normal with remote teams
2. Open the conflicted files (marked with `<<<<<<<`, `=======`, `>>>>>>>`)
3. Decide which code to keep (yours, theirs, or both)
4. Remove the conflict markers
5. Test that everything still works
6. Commit the resolved conflicts
7. If stuck, message the group for help

**Avoiding conflicts:**
- Communicate what you're working on
- Don't edit the same files as teammates at the same time
- Pull and merge `dev` frequently
- Keep features small and merge often

### .gitignore Templates

**Backend (.gitignore in /backend folder):**
```
# Compiled files
target/
*.class

# IDE files
.idea/
.vscode/
*.iml

# Spring Boot
application-local.properties

# Logs
*.log

# OS files
.DS_Store
Thumbs.db

# Environment variables
.env
```

**Frontend (.gitignore in /frontend folder):**
```
# Dependencies
node_modules/

# Build files
build/
dist/

# IDE files
.idea/
.vscode/

# Environment
.env
.env.local

# Logs
npm-debug.log*
yarn-debug.log*

# OS files
.DS_Store
Thumbs.db

# Testing
coverage/
```

### Emergency Procedures

**If you accidentally pushed to main:**
```bash
# Don't force push! Contact team immediately
# We'll revert together
```

**If you lost local changes:**
```bash
# Check if they're staged
git status

# Check recent commits
git log

# Recover deleted files
git checkout HEAD <filename>
```

**If everything is broken:**
1. Don't force push or delete anything
2. Message the group immediately with error messages
3. We'll debug together on a call if needed

### Communication Protocol

**Before pushing major changes:**
- Post in group: "About to merge authentication system to dev"
- Wait 5 minutes for any objections
- Merge and notify when done

**After merging to dev:**
- Post in group: "Just merged X to dev. Please pull latest and test on your end"

**If you break something:**
- Own it immediately: "My merge broke Y feature, working on fix"
- Fix ASAP or revert your changes
- Learn from it - we're all learning

### Quick Reference Commands

```bash
# See what branch you're on
git branch

# See status of your files
git status

# Discard local changes to a file
git checkout -- <filename>

# Update your branch with latest from GitHub
git pull origin <branch-name>

# See commit history
git log --oneline

# Switch branches
git checkout <branch-name>

# Create and switch to new branch
git checkout -b <new-branch-name>

# Delete local branch
git branch -d <branch-name>

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

---

