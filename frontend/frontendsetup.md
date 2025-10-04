## Prerequisites - Install These First

### Install Node.js (Required)
**What it does:** Provides npm and the JavaScript runtime needed to run the project

**Steps:**
1. Visit https://nodejs.org/
2. Download the **LTS version** (Long Term Support)
3. Run the installer and follow the prompts
4. Restart your terminal/command prompt

**Verify installation:**
```bash
# Check Node.js is installed
node --version
# Should output: v18.x.x or higher

# Check npm is installed (comes with Node.js)
npm --version
# Should output: 9.x.x or higher
```

## Setup Steps - Run These Commands

### Step 1: Clone the Repository
**What this does:** Downloads the project from GitHub to your computer

```bash
# Navigate to your preferred folder (e.g., Documents)
cd ~/Documents

# Clone the repository (replace with actual URL)
git clone https://github.com/YOUR-USERNAME/Secure-Messaging-App.git

# Enter the project directory
cd Secure-Messaging-App
```

### Step 2: Navigate to Frontend Folder
**What this does:** Moves you into the frontend directory

```bash
# Change directory to frontend
cd frontend

```

### Step 3: Install All Dependencies
**What this does:** Downloads ALL required packages (React, TypeScript, Tailwind, etc.)

```bash
# Install all dependencies from package.json
npm install
```

**What happens:**
- Reads `package.json` to see what's needed
- Downloads ~200MB of packages into `node_modules/`
- Takes 2-5 minutes depending on internet speed
- Shows progress with package names scrolling

**Expected output:**
```
added 185 packages in 2m
```

### Step 4: Create Environment Variables File
**What this does:** Configures the backend API URLs

**Option A - Mac/Linux:**
```bash
# Create .env file with API configuration
cat > .env << 'EOL'
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
EOL
```

**Option B - Windows (or manual):**
1. Create a new file named `.env` in the `frontend` folder
2. Add these lines:
```
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
```
3. Save the file

### Step 5: Start the Development Server
**What this does:** Runs the app locally on your machine

```bash
# Start the dev server
npm run dev
```

**Expected output:**
```
VITE v5.4.1  ready in 413 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 6: View the Application
**What this does:** Opens the running app in your browser

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the ChatApp homepage

**To stop the server:** Press `Ctrl + C` in the terminal

---

## Understanding the File Structure

**What each file does:**

### Configuration Files (Root Level)

| File | Purpose |
|------|---------|
| **package.json** | Lists all dependencies and npm scripts. Tells npm what to install. |
| **package-lock.json** | Locks exact versions of dependencies. Ensures everyone installs the same versions. Auto-generated. |
| **tsconfig.json** | TypeScript compiler settings. Tells TypeScript how to compile .tsx files to JavaScript. |
| **tsconfig.node.json** | TypeScript settings for Node.js environment (used by Vite config). |
| **vite.config.ts** | Vite build tool configuration. Defines dev server settings, plugins, and proxy for backend API. |
| **tailwind.config.js** | Tailwind CSS configuration. Tells Tailwind which files to scan for classes. |
| **postcss.config.js** | PostCSS configuration. Processes CSS (Tailwind + Autoprefixer). |
| **index.html** | HTML entry point. Contains the root div where React renders. |
| **.env** | Environment variables (API URLs). You create this manually. |
| **.gitignore** | Lists files Git should ignore (node_modules, .env, etc.). |

### Source Code Files (src/ folder)

| File | Purpose |
|------|---------|
| **main.tsx** | Application entry point. Renders the App component into the DOM. |
| **App.tsx** | Main app component. Manages routing between pages (home/signin/signup). |
| **index.css** | Global styles. Imports Tailwind CSS and sets basic styling. |
| **vite-env.d.ts** | TypeScript type definitions for Vite environment variables. |

### Components (src/components/)

| File | Purpose |
|------|---------|
| **HomePage.tsx** | Landing page. Displays hero section with "Connect and Chat in Real-Time" and CTA buttons. |
| **SignInPage.tsx** | Login page. Form with username/password fields. Calls backend login API. |
| **SignUpPage.tsx** | Registration page. Form with username/password/confirm password. Calls backend register API. |
| **Navbar.tsx** | Navigation bar. Shows logo and Login/Sign Up buttons on all pages. |

### Types (src/types/)

| File | Purpose |
|------|---------|
| **index.ts** | TypeScript type definitions. Defines interfaces for AuthCredentials, User, PageType, etc. |

### Utils (src/utils/)

| File | Purpose |
|------|---------|
| **api.ts** | API utility functions. Contains axios instance, token management, and authentication API calls (login/register). |

### Auto-Generated Folders

| Folder | Purpose |
|--------|---------|
| **node_modules/** | Contains all installed npm packages. Auto-generated by `npm install`. Never edit manually. |

---

## Summary

**What you installed:**
- Node.js (includes npm)
- Git

**What npm installed for you:**
- React, TypeScript, Tailwind CSS, Vite, Axios, and all other packages

**You only need to run `npm install` once**, unless `package.json` changes.