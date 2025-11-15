# MyNetRunner API Documentation

## Base URL
```
http://localhost:8080
```

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [WebSocket Connection](#websocket-connection)
3. [Message Endpoints](#message-endpoints)
4. [Response Codes](#response-codes)

---

## Authentication Endpoints

### 1. Register New User

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "alejandro",
  "password": "password123"
}
```

**Validation Rules:**
- Username: Required, 3-50 characters, alphanumeric and underscores only
- Password: Required, minimum 8 characters

**Success Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGVqYW5kcm8iLCJpYXQiOjE2OTY...",
  "username": "alejandro",
  "message": "User registered successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "token": null,
  "username": null,
  "message": "Username already exists"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alejandro",
    "password": "password123"
  }'
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate existing user and receive JWT token

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "alejandro",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGVqYW5kcm8iLCJpYXQiOjE2OTY...",
  "username": "alejandro",
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "token": null,
  "username": null,
  "message": "Invalid username or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alejandro",
    "password": "password123"
  }'
```

**JWT Token:**
- Token expires after 24 hours
- Store token on client side (localStorage or secure storage)
- Include in future requests for authentication (Phase 2)

---

## WebSocket Connection

### Connection Details

**WebSocket Endpoint:**
```
ws://localhost:8080/ws
```

**Protocol:** STOMP over SockJS

**Libraries Needed (Frontend):**
- `sockjs-client` - WebSocket fallback support
- `stompjs` or `@stomp/stompjs` - STOMP protocol

---

### Connect to WebSocket

**JavaScript Example:**
```javascript
// Using SockJS and STOMP
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);
    
    // Subscribe to receive messages for your user
    const userId = 1; // Your user ID
    stompClient.subscribe('/topic/messages/' + userId, function(message) {
        const messageData = JSON.parse(message.body);
        console.log('Received message:', messageData);
    });
});
```

---

### Subscribe to Receive Messages

**Subscription Endpoint:** `/topic/messages/{userId}`

**Description:** Subscribe to this topic to receive real-time messages for a specific user

**Example:**
```javascript
stompClient.subscribe('/topic/messages/1', function(message) {
    const data = JSON.parse(message.body);
    // Handle received message
});
```

**Message Format Received:**
```json
{
  "id": 123,
  "senderId": 2,
  "senderUsername": "john",
  "receiverId": 1,
  "content": "Hello there!",
  "timestamp": "2025-10-02T17:30:00",
  "delivered": true
}
```

---

### Send a Message

**Send to:** `/app/chat`

**Description:** Send a message to another user via WebSocket

**Message Format to Send:**
```json
{
  "senderId": 1,
  "receiverId": 2,
  "content": "Hello! How are you?"
}
```

**JavaScript Example:**
```javascript
const message = {
    senderId: 1,
    receiverId: 2,
    content: "Hello! How are you?"
};

stompClient.send('/app/chat', {}, JSON.stringify(message));
```

**Important Notes:**
- Messages are delivered in **real-time** via WebSocket
- Messages are **NOT stored permanently** on the server
- Messages are **deleted immediately** after delivery (privacy feature)
- Undelivered messages expire after 30 days
- Store messages locally on client device if history is needed

---

## Message Endpoints

### Health Check

**Endpoint:** `GET /api/health`

**Description:** Check if the backend is running

**Success Response (200 OK):**
```
MyNetRunner Backend is running!
```

**cURL Example:**
```bash
curl http://localhost:8080/api/health
```

---

## Response Codes

### Success Codes
| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully (e.g., user registration) |

### Error Codes
| Code | Status | Description |
|------|--------|-------------|
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Invalid credentials or authentication failed |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Data Models

### User
```json
{
  "id": 1,
  "username": "alejandro",
  "createdAt": "2025-10-02T10:30:00"
}
```
*Note: Password hash is never returned in responses*

### Message (Real-time WebSocket)
```json
{
  "id": 123,
  "senderId": 1,
  "senderUsername": "alejandro",
  "receiverId": 2,
  "content": "Hello!",
  "timestamp": "2025-10-02T17:30:00",
  "delivered": true
}
```

**Current Implementation Notes:**
- `senderId` and `receiverId` are plaintext user IDs (not hashed)
- `content` is plaintext message content (not encrypted)
- End-to-end encryption will be implemented in Phase 2 with frontend
- Server temporarily stores plaintext but deletes immediately after delivery

---

## Privacy & Security Notes

### Message Privacy (Signal-Inspired)
- ✅ Messages are **NOT stored permanently** on the server
- ✅ Messages **deleted immediately** after real-time delivery via WebSocket
- ✅ Undelivered messages auto-expire after 30 days
- ✅ No message history stored server-side
- ✅ Scheduled cleanup job runs daily at 3 AM to purge expired messages
- ⚠️ **Current Phase:** Messages stored as plaintext temporarily (milliseconds)
- 🔒 **Phase 2:** End-to-end encryption (client-side encryption before sending)

**How Message Deletion Works:**
1. User A sends message to User B
2. Message saved temporarily in database
3. Message delivered to User B via WebSocket in real-time
4. **Message immediately deleted from database** (typically within milliseconds)
5. If User B is offline, message remains in queue until delivered or expires after 30 days

### Authentication
- ✅ Passwords hashed with BCrypt (never stored in plaintext)
- ✅ JWT tokens for session management (expires after 24 hours)
- ⚠️ **Current Phase:** All endpoints permit all requests (development mode)
- 🔒 **Phase 2:** JWT authentication required for protected endpoints

---

## Testing

### Quick Test Checklist

1. **Health Check:**
```bash
curl http://localhost:8080/api/health
```

2. **Register User:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

3. **Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

4. **WebSocket Testing:**
   - Use the provided `websocket-test.html` file
   - Open in multiple browser tabs with different user IDs
   - Send messages and verify real-time delivery
   - Messages should appear instantly in recipient's tab

---

## Frontend Integration Guide

### 1. Setup Dependencies
```bash
npm install sockjs-client @stomp/stompjs
# or
yarn add sockjs-client @stomp/stompjs
```

### 2. Connect to WebSocket
```javascript
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, (frame) => {
    console.log('Connected:', frame);
    
    // Subscribe to messages for your user ID
    const userId = 1; // Get this from your auth state
    stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
        const data = JSON.parse(message.body);
        // Update UI with received message
        console.log('Received:', data);
    });
});
```

### 3. Send Messages
```javascript
const sendMessage = (senderId, receiverId, content) => {
    const message = {
        senderId: senderId,
        receiverId: receiverId,
        content: content
    };
    
    stompClient.send('/app/chat', {}, JSON.stringify(message));
};
```

### 4. Handle Authentication
```javascript
// Register
const register = async (username, password) => {
    const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        // Store JWT token
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
    }
    
    return data;
};

// Login
const login = async (username, password) => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
    }
    
    return data;
};
```

### 5. Store Messages Locally (Recommended)

Since the server doesn't store message history, implement local storage in your frontend:
```javascript
// Store message in browser's IndexedDB or localStorage
const saveMessageLocally = (message) => {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
};

// When receiving a message
stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
    const data = JSON.parse(message.body);
    
    // Save to local storage
    saveMessageLocally(data);
    
    // Update UI
    displayMessage(data);
});
```

---

## Architecture Overview
```
┌─────────────┐                    ┌─────────────┐
│   Client A  │                    │   Client B  │
│  (Browser)  │                    │  (Browser)  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ 1. Send message                  │
       │ POST /app/chat                   │
       ├──────────────────────────────────┤
       │                                  │
       │         ┌──────────────────┐     │
       │         │  MyNetRunner     │     │
       │         │  Backend Server  │     │
       │         │                  │     │
       │         │  [PostgreSQL]    │     │
       │         │  • Temp storage  │     │
       │         │  • Auto-delete   │     │
       │         └────────┬─────────┘     │
       │                  │               │
       │ 2. Deliver via WebSocket         │
       │ /topic/messages/B                │
       │                  └───────────────►│
       │                                  │
       │ 3. Message deleted from DB       │
       │    (happens automatically)       │
```

**Key Points:**
1. Messages stored temporarily (usually milliseconds)
2. Real-time delivery via WebSocket
3. Immediate deletion after successful delivery
4. Clients responsible for local message storage
5. Server acts as a relay, not a storage system

---

## Future Enhancements (Phase 2+)

### End-to-End Encryption
```javascript
// Pseudocode for Phase 2
const encryptMessage = (message, recipientPublicKey) => {
    // Encrypt message client-side before sending
    return encrypt(message, recipientPublicKey);
};

const sendEncryptedMessage = (senderId, receiverId, content) => {
    const recipientPublicKey = getPublicKey(receiverId);
    const encryptedContent = encryptMessage(content, recipientPublicKey);
    
    stompClient.send('/app/chat', {}, JSON.stringify({
        senderId: senderId,
        receiverId: receiverId,
        content: encryptedContent // Server can't read this
    }));
};
```

### Other Planned Features
- Group messaging support
- Message read receipts
- Typing indicators
- File/image attachment support
- User online/offline status (Redis)
- Message reactions

---

## Troubleshooting

### Common Issues

**1. WebSocket Connection Failed**
- Ensure backend is running: `http://localhost:8080`
- Check browser console for errors
- Verify firewall isn't blocking WebSocket connections

**2. Messages Not Appearing**
- Verify both users are subscribed to correct topics
- Check that user IDs are correct
- Open browser dev tools and check network tab

**3. Authentication Failed**
- Verify username and password are correct
- Check that user exists (register first)
- Ensure Content-Type header is set correctly

**4. CORS Errors (when connecting from frontend)**
- CORS configuration needed for production
- Currently all origins allowed in development mode

---

## Support & Questions

For questions or issues with the API:
- Check this documentation first
- Test endpoints with cURL or the WebSocket test client
- Review console logs for error messages
- Ensure backend is running on `http://localhost:8080`

---

**Last Updated:** October 2025  
**API Version:** 1.0  
**Backend Framework:** Spring Boot 3.4.10  
**Current Phase:** Phase 1 (Privacy-focused temporary storage)  
**Next Phase:** Phase 2 (End-to-end encryption with frontend)