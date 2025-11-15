# To-Do List - Secure Messaging App
**Demo Date: This Saturday**

## 🎯 Demo Week Goals
Goal: Have a functional demo with user registration, login, and basic messaging capability

---

📋 Backend Priority Tasks (Alejandro)

Critical - Must Complete by Thursday ✅ COMPLETE!
* [✅] **Project Setup**
   * [✅] Initialize Spring Boot project with dependencies (Spring Web, Spring Security, WebSocket, PostgreSQL, Redis, JPA)
   * [✅] Set up PostgreSQL database (local instance)
   * [✅] Set up Redis (local instance or Docker)
   * [✅] Configure application.properties for database connections
   * [✅] Create basic project structure (controllers, services, repositories, models)
* [✅] **User Authentication System**
   * [✅] Create User entity/model (id, username, password hash, created_at)
   * [✅] Create UserRepository (JPA)
   * [✅] Implement UserService (registration, login logic)
   * [✅] Implement password hashing (BCrypt)
   * [✅] Create AuthController with endpoints:
      * `POST /api/auth/register` - User registration
      * `POST /api/auth/login` - User login
   * [✅] Implement basic JWT token generation
   * [✅] Test authentication endpoints with Postman/curl
* [✅] **Basic Messaging Backend (Privacy-Focused)**
   * [✅] Create Message entity (id, senderId, receiverId, content, timestamp, delivered, expiresAt)
      * Messages stored temporarily only
      * Auto-expire after 30 days if undelivered
   * [✅] Create MessageRepository with auto-expiration queries
   * [✅] Create MessageService with immediate deletion after delivery
   * [✅] Configure WebSocket with STOMP for real-time delivery
   * [✅] Create WebSocket configuration class
   * [✅] Implement WebSocketMessageController
      * Endpoint: `/app/chat` - Send messages
      * Subscription: `/topic/messages/{userId}` - Receive messages
      * **Messages deleted immediately after WebSocket delivery**
   * [✅] Create scheduled job for purging expired messages (runs daily at 3 AM)
   * [✅] Test WebSocket connection with HTML test client

**🔒 Privacy Implementation Notes:**
- Messages are NOT stored permanently (Signal-inspired approach)
- Messages deleted from server immediately after real-time delivery
- Undelivered messages auto-expire after 30 days
- No message history stored on server
- Users should store messages locally on client devices

Important - Complete by Friday
* **API Documentation**
   * [✅] Document all REST endpoints in README or shared doc
      * Authentication endpoints (register, login)
      * WebSocket connection details
   * [✅] Include request/response examples for frontend team
   * [✅] Document error codes and responses
   * [✅] Share base URL and WebSocket endpoint URLs

* **Input Validation & Error Handling**
   * [✅] Add username validation (3-50 characters, alphanumeric)
   * [✅] Add password requirements (minimum 6 characters)
   * [✅] Implement proper error messages for validation failures
   * [✅] Add HTTP status codes for all responses
      * 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error
   * [✅] Create custom exception handlers (@ControllerAdvice)
   * [✅] Add try-catch blocks for better error handling

* **CORS Configuration**
   * [✅] Configure CORS in SecurityConfig
   * [✅] Allow frontend origin (localhost:3000 for development)
   * [✅] Configure allowed methods (GET, POST, PUT, DELETE)
   * [✅] Configure allowed headers
   * [✅] Test CORS with frontend connection

* **Redis Integration**
   * [ ] Implement Redis for caching online users
   * [ ] Create service to track user online/offline status
   * [ ] Store active WebSocket sessions in Redis
   * [ ] Create endpoint to check user online status: `GET /api/users/{userId}/status`
   * [ ] Update status when user connects/disconnects from WebSocket
   * [ ] Add presence notification via WebSocket

Future Enhancements
* End-to-end encryption (Phase 2)
   * Client-side encryption before sending to server
   * Server only relays encrypted blobs
   * Implement key exchange protocol
* Group messaging support
* Message read receipts
* Typing indicators
* File/image attachment support

---

## 🎨 Frontend Guidelines (Jane)
**Note: These are suggestions - frontend has creative freedom**

### Suggested Pages for Demo
- [✅] **Landing/Home Page**
  - Basic welcome page with navigation to login/register

- [✅] **Registration Page**
  - Form with username and password fields
  - Call `POST /api/auth/register` endpoint

- [✅] **Login Page**
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
