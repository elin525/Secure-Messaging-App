# To-Do List - Secure Messaging App
**Demo Date: This Saturday**

## 🎯 Demo Week Goals
Goal: Have a functional demo with user registration, login, and basic messaging capability

---

## 📋 Backend Priority Tasks (Alejandro)

### Critical - Must Complete by Thursday
- [✅] **Project Setup**
  - [✅] Initialize Spring Boot project with dependencies (Spring Web, Spring Security, WebSocket, PostgreSQL, Redis, JPA)
  - [✅] Set up PostgreSQL database (local instance)
  - [✅] Set up Redis (local instance or Docker)
  - [✅] Configure application.properties for database connections
  - [✅] Create basic project structure (controllers, services, repositories, models)

- [✅] **User Authentication System**
  - [✅] Create User entity/model (id, username, password hash, created_at)
  - [✅] Create UserRepository (JPA)
  - [✅] Implement UserService (registration, login logic)
  - [✅] Implement password hashing (BCrypt)
  - [✅] Create AuthController with endpoints:
    - `POST /api/auth/register` - User registration
    - `POST /api/auth/login` - User login
  - [✅] Implement basic JWT token generation
  - [✅] Test authentication endpoints with Postman/curl

- [✅] **Basic Messaging Backend**
  - [✅] Create Message entity (id, senderIdHash, receiverIdHash, encryptedContent, timestamp, delivered, expiresAt)
  - [✅] Create MessageRepository with auto-expiration queries
  - [✅] Create MessageService
  - [✅] Configure WebSocket with STOMP for real-time delivery
  - [✅] Create WebSocket configuration class
  - [✅] Implement MessageController for WebSocket
  - [✅] Create scheduled job for purging expired messages
  - [✅] Test WebSocket connection with a WebSocket client

### Important - Complete by Friday
- [ ] **Message Storage**
  - [ ] Implement MessageService to save messages to PostgreSQL
  - [ ] Create endpoint to retrieve message history: `GET /api/messages/{userId}`
  - [ ] Test message persistence

- [ ] **API Documentation**
  - [ ] Document all REST endpoints in README or shared doc
  - [ ] Include request/response examples for frontend team
  - [ ] Share base URL and WebSocket connection details

### Nice to Have - If Time Permits
- [ ] Basic input validation (username length, password requirements)
- [ ] Error handling and proper HTTP status codes
- [ ] CORS configuration for frontend integration
- [ ] Redis caching for online users

---

## 🎨 Frontend Guidelines (Jane)
**Note: These are suggestions - frontend has creative freedom**

### Suggested Pages for Demo
- [ ] **Landing/Home Page**
  - Basic welcome page with navigation to login/register

- [ ] **Registration Page**
  - Form with username and password fields
  - Call `POST /api/auth/register` endpoint

- [ ] **Login Page**
  - Form with username and password fields
  - Call `POST /api/auth/login` endpoint
  - Store JWT token in localStorage

- [ ] **Chat Page (Simple Version)**
  - Basic chat interface with message list and input box
  - Connect to WebSocket
  - Send and receive messages in real-time
  - Display messages from current user and one other user

### Frontend Tech Reminders
- Use React + TypeScript
- Tailwind CSS for styling
- WebSocket client library (SockJS + STOMP)
- Axios or Fetch for REST API calls

---

## 🔧 Lawrence's Tasks (Full Stack)

### Backend Support
- [ ] Help with testing backend endpoints
- [ ] Set up Postman collection for all API endpoints
- [ ] Write basic integration tests
- [ ] Help debug any Spring Boot issues

### Frontend Support
- [ ] Assist with WebSocket connection setup
- [ ] Help integrate backend API calls
- [ ] Test user flows (register → login → chat)

### Integration
- [ ] Ensure frontend and backend can communicate (CORS, ports)
- [ ] Test end-to-end flow: register → login → send message
- [ ] Document any issues or blockers

---

## ✅ Demo Day Checklist

### Technical Setup
- [ ] Backend deployed locally and running
- [ ] Frontend deployed locally and running
- [ ] Database populated with test data (2-3 test users)
- [ ] All services tested and working
- [ ] Backup plan if live demo fails (screenshots/video)

### Presentation
- [ ] Prepare 3-5 minute demo script
- [ ] Decide who presents what
- [ ] Practice demo walkthrough at least once
- [ ] Prepare answers for expected questions

### Demo Flow
1. Show landing page
2. Register a new user
3. Login with that user
4. Open second browser/incognito for second user
5. Send messages between users in real-time
6. Highlight the technologies used

---

## 📝 Notes
- Keep it simple - this is just a proof of concept
- Focus on functionality over appearance
- Don't implement encryption yet - that comes later
- Document everything as you go
- Ask for help early if blocked
