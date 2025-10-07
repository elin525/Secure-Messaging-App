# How to Run the Secure Messaging App

> 📋 **Quick Navigation**: 
> - Platform Instructions: [Windows](#windows-instructions) | [Linux/macOS](#linuxmacos-instructions)
> - Help: [Troubleshooting](#troubleshooting) | [Quick Reference](#platform-specific-quick-reference)
> - Usage: [Using the App](#using-the-application) | [Testing](#testing-the-chat-functionality)

## Prerequisites

Before running the application, ensure you have the following installed:

1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://adoptium.net/
   - Verify installation: `java -version`

2. **Node.js and npm** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

---

## Windows Instructions

### Step 1: Navigate to the Project Directory

Open PowerShell or Command Prompt and navigate to the project root:

```powershell
cd "path\to\Secure-Messaging-App"
```

*Replace `path\to\` with the actual path where you cloned/downloaded the project.*

---

### Step 2: Set Up the Backend (Spring Boot)

#### 2.1 Navigate to the Backend Directory

```powershell
cd backend
```

#### 2.2 Set Java Environment Variables (if needed)

If you get a "JAVA_HOME not defined" error, set it temporarily:

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
$env:PATH += ";C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot\bin"
```

*Note: Adjust the path to match your JDK installation location.*

#### 2.3 Run the Backend Server

```powershell
.\mvnw.cmd spring-boot:run
```

**What to expect:**
- Maven will download dependencies (first time only)
- Spring Boot will start on port 8080
- H2 database will be created in memory
- You should see: `Started BackendApplication in X seconds`

**Leave this terminal window open!** The backend must remain running.

---

### Step 3: Set Up the Frontend (React + Vite)

#### 3.1 Open a New Terminal Window

Open a **new** PowerShell or Command Prompt window (don't close the backend terminal).

#### 3.2 Navigate to the Frontend Directory

```powershell
cd "path\to\Secure-Messaging-App\frontend"
```

*Replace `path\to\` with your project's location.*

#### 3.3 Install Dependencies (First Time Only)

If you haven't installed dependencies yet:

```powershell
npm install
```

This will download all required Node.js packages.

#### 3.4 Set Node.js Path (if needed)

If npm is not recognized, add Node.js to your PATH temporarily:

```powershell
$env:PATH += ";C:\Program Files\nodejs"
```

#### 3.5 Run the Frontend Development Server

```powershell
npm run dev
```

**What to expect:**
- Vite dev server will start on port 3000
- You should see: `Local: http://localhost:3000/`
- Hot module replacement (HMR) is enabled for live updates

**Leave this terminal window open too!**

---

### Step 4: Access the Application

1. Open your web browser (Chrome, Firefox, or Edge recommended)
2. Navigate to: **http://localhost:3000/**
3. You should see the NetRunner Chat home page

---

## Using the Application

### Creating an Account

1. Click the **"Sign Up"** button on the home page
2. Enter a username and password
3. Confirm your password
4. Click "Create Account"
5. You'll be automatically logged in and redirected to the chat page

### Logging In

1. Click the **"Login"** button on the home page
2. Enter your username and password
3. Click "Sign In"
4. You'll be redirected to the chat page

### Starting a New Chat

1. Once logged in, click the **"+"** button in the conversations sidebar
2. A modal will appear showing all registered users
3. Click on a user to start chatting with them
4. Type your message in the input field at the bottom
5. Press **Enter** or click the **Send** button

### Logging Out

- Click the **"Logout"** button in the top-right corner
- You'll be redirected to the home page

---

## Linux/macOS Instructions

### Step 1: Navigate to the Project Directory

Open Terminal and navigate to the project root:

```bash
cd "/path/to/Secure-Messaging-App"
```

*Replace `/path/to/` with the actual path to your project directory.*

---

### Step 2: Set Up the Backend (Spring Boot)

#### 2.1 Navigate to the Backend Directory

```bash
cd backend
```

#### 2.2 Make Maven Wrapper Executable (First Time Only)

```bash
chmod +x mvnw
```

#### 2.3 Set Java Environment Variables (if needed)

If you get a "JAVA_HOME not defined" error, set it:

**For macOS (with Homebrew JDK):**
```bash
export JAVA_HOME=$(/usr/libexec/java_home)
```

**For Linux:**
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

*Note: Adjust the path to match your JDK installation location. Find it with: `which java` or `update-alternatives --list java`*

#### 2.4 Run the Backend Server

```bash
./mvnw spring-boot:run
```

**What to expect:**
- Maven will download dependencies (first time only)
- Spring Boot will start on port 8080
- H2 database will be created in memory
- You should see: `Started BackendApplication in X seconds`

**Leave this terminal window open!** The backend must remain running.

---

### Step 3: Set Up the Frontend (React + Vite)

#### 3.1 Open a New Terminal Window

Open a **new** Terminal window (don't close the backend terminal).

**macOS:** Press `Cmd + T` for a new tab or `Cmd + N` for a new window

**Linux:** Press `Ctrl + Shift + T` for a new tab or `Ctrl + Shift + N` for a new window

#### 3.2 Navigate to the Frontend Directory

```bash
cd "/path/to/Secure-Messaging-App/frontend"
```

#### 3.3 Install Dependencies (First Time Only)

If you haven't installed dependencies yet:

```bash
npm install
```

This will download all required Node.js packages.

#### 3.4 Run the Frontend Development Server

```bash
npm run dev
```

**What to expect:**
- Vite dev server will start on port 3000
- You should see: `Local: http://localhost:3000/`
- Hot module replacement (HMR) is enabled for live updates

**Leave this terminal window open too!**

---

### Step 4: Access the Application

1. Open your web browser (Chrome, Firefox, or Safari recommended)
2. Navigate to: **http://localhost:3000/**
3. You should see the NetRunner Chat home page

---

## Troubleshooting

### Backend Issues

**Error: "JAVA_HOME is not defined"**
- **Windows:** Set JAVA_HOME as shown in Windows Step 2.2
- **Linux/macOS:** Set JAVA_HOME as shown in Linux/macOS Step 2.3

**Error: "Port 8080 already in use"**
- **Windows:** Stop any other process using port 8080:
  ```powershell
  netstat -ano | findstr :8080
  taskkill /F /PID <PID>
  ```
- **Linux/macOS:** Find and kill the process:
  ```bash
  # Find the process
  lsof -i :8080
  # Or
  netstat -tulpn | grep :8080
  
  # Kill the process (replace <PID> with the actual process ID)
  kill -9 <PID>
  ```

**Error: "Could not find or load main class"**
- Solution: Make sure you're in the `backend` directory
- **Windows:** Run `.\mvnw.cmd clean install` to rebuild
- **Linux/macOS:** Run `./mvnw clean install` to rebuild

**Error: "Permission denied" (Linux/macOS only)**
- Solution: Make the Maven wrapper executable:
  ```bash
  chmod +x mvnw
  ```

### Frontend Issues

**Error: "npm is not recognized"**
- **Windows:** Install Node.js or add it to PATH (see Windows Step 3.4)
- **Linux/macOS:** Install Node.js:
  - **macOS:** `brew install node` (using Homebrew)
  - **Ubuntu/Debian:** `sudo apt install nodejs npm`
  - **Fedora:** `sudo dnf install nodejs npm`

**Error: "Port 3000 already in use"**
- Solution: Stop the existing dev server or use a different port:
  ```bash
  npm run dev -- --port 3001
  ```

**Error: "Cannot find module"**
- Solution: Delete `node_modules` and reinstall:
  - **Windows:**
    ```powershell
    Remove-Item -Recurse -Force node_modules
    npm install
    ```
  - **Linux/macOS:**
    ```bash
    rm -rf node_modules
    npm install
    ```

**Error: "EACCES: permission denied" (Linux/macOS)**
- Solution: Fix npm permissions or use a version manager like nvm:
  ```bash
  # Option 1: Fix permissions (not recommended)
  sudo chown -R $USER ~/.npm
  
  # Option 2: Use nvm (recommended)
  # Install nvm first: https://github.com/nvm-sh/nvm
  nvm install 18
  nvm use 18
  ```

### Connection Issues

**WebSocket Warnings in Backend Logs**
- These are normal during development
- The frontend is trying to connect before fully loaded
- Messages will work once both users are connected

**CORS Errors**
- Make sure the backend is running on port 8080
- Make sure the frontend is running on port 3000
- Check `SecurityConfig.java` has CORS enabled

---

## Quick Commands Reference

### Backend

**Windows:**
```powershell
# Navigate to backend
cd "path\to\Secure-Messaging-App\backend"

# Run backend
.\mvnw.cmd spring-boot:run

# Clean and rebuild
.\mvnw.cmd clean install

# Stop backend
Ctrl + C
```

**Linux/macOS:**
```bash
# Navigate to backend
cd "/path/to/Secure-Messaging-App/backend"

# Make executable (first time only)
chmod +x mvnw

# Run backend
./mvnw spring-boot:run

# Clean and rebuild
./mvnw clean install

# Stop backend
Ctrl + C
```

### Frontend

**All Platforms:**
```bash
# Navigate to frontend (adjust path for your OS)
cd "/path/to/Secure-Messaging-App/frontend"

# Install dependencies
npm install

# Run frontend
npm run dev

# Build for production
npm run build

# Stop frontend
Ctrl + C  # (or Cmd + C on macOS)
```

---

## Testing the Chat Functionality

To test real-time messaging between users:

1. **Register two or more users** (e.g., "alice", "bob", "charlie")
2. **Open the app in two different browser windows/tabs**
3. **Log in as different users in each window**
   - Window 1: Log in as "alice"
   - Window 2: Log in as "bob"
4. **In Window 1 (alice):**
   - Click the "+" button
   - Select "bob" from the user list
   - Send a message
5. **In Window 2 (bob):**
   - The message from alice should appear in real-time
   - Click the "+" button and select "alice" to reply

---

## Current Features

✅ **Working:**
- User registration and login
- JWT authentication
- Real-time WebSocket messaging
- User list fetching
- Contact selection
- Message sending/receiving
- Auto-redirect when logged in
- Chat only accessible after login

⚠️ **Known Limitations:**
- User ID is hardcoded (always 1) - needs backend fix
- No message persistence (messages lost on refresh)
- No message history loading
- No read receipts
- No typing indicators
- WebSocket connection warnings (cosmetic only)

---

## Database Access (H2 Console)

The backend uses an in-memory H2 database. To view the database:

1. Make sure the backend is running
2. Go to: **http://localhost:8080/h2-console**
3. Use these credentials:
   - **JDBC URL:** `jdbc:h2:mem:testdb`
   - **Username:** `sa`
   - **Password:** `password`
4. Click "Connect"
5. You can run SQL queries to view users and messages

**Example queries:**
```sql
SELECT * FROM USERS;
SELECT * FROM MESSAGES;
```

---

## Stopping the Application

To properly shut down the application:

1. **Stop the Frontend:**
   - Go to the frontend terminal
   - Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (macOS)
   - Confirm with `Y` if prompted

2. **Stop the Backend:**
   - Go to the backend terminal
   - Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (macOS)
   - Wait for graceful shutdown

---

## Next Steps / Improvements Needed

- Fix hardcoded user ID issue
- Add message persistence
- Implement message history loading
- Add proper WebSocket error handling
- Add user profile management
- Implement message encryption
- Add file sharing capability
- Implement group chats

---

## Support

If you encounter any issues:

1. Check both terminal windows for error messages
2. Verify both servers are running (backend on 8080, frontend on 3000)
3. Clear browser cache and localStorage
4. Restart both servers
5. Check the troubleshooting section above

**Browser Console:**
- Press `F12` to open developer tools
- Check the "Console" tab for frontend errors
- Check the "Network" tab for API/WebSocket issues

**Backend Logs:**
- Look at the terminal running the backend
- Errors will appear in red
- Stack traces provide detailed error information

---

## Platform-Specific Quick Reference

| Task | Windows | Linux/macOS |
|------|---------|-------------|
| **Navigate to directory** | `cd "C:\path\to\folder"` | `cd "/path/to/folder"` |
| **Run backend** | `.\mvnw.cmd spring-boot:run` | `./mvnw spring-boot:run` |
| **Make file executable** | N/A | `chmod +x mvnw` |
| **Find process on port** | `netstat -ano \| findstr :8080` | `lsof -i :8080` |
| **Kill process** | `taskkill /F /PID <PID>` | `kill -9 <PID>` |
| **Delete directory** | `Remove-Item -Recurse -Force folder` | `rm -rf folder` |
| **Set environment variable** | `$env:VAR = "value"` | `export VAR="value"` |
| **Stop process** | `Ctrl + C` | `Ctrl + C` (or `Cmd + C` on macOS) |
| **Path separator** | `\` (backslash) | `/` (forward slash) |

### Installation Commands

| Tool | Windows | macOS | Linux (Ubuntu/Debian) |
|------|---------|-------|----------------------|
| **Java** | Download installer from adoptium.net | `brew install openjdk@17` | `sudo apt install openjdk-17-jdk` |
| **Node.js** | Download installer from nodejs.org | `brew install node` | `sudo apt install nodejs npm` |
| **Git** | Download installer from git-scm.com | `brew install git` | `sudo apt install git` |

