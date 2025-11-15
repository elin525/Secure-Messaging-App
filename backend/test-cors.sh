#!/bin/bash

echo "=========================================="
echo "MyNetRunner CORS Configuration Tests"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Prerequisites:${NC}"
echo "1. Spring Boot application must be running on http://localhost:8080"
echo "2. PostgreSQL database must be running"
echo "3. Updated SecurityConfig.java and WebSocketConfig.java must be in place"
echo ""
read -p "Press Enter to start testing..."
echo ""

# Test 1: Health Check (baseline test)
echo "=========================================="
echo -e "${YELLOW}Test 1: Health Check (Baseline)${NC}"
echo "=========================================="
echo "Testing: GET http://localhost:8080/api/health"
echo ""
curl -X GET http://localhost:8080/api/health \
  -H "Origin: http://localhost:3000" \
  -v 2>&1 | grep -E "(< HTTP|< Access-Control|status|message)"
echo ""
echo "Expected: Should see 'Access-Control-Allow-Origin: http://localhost:3000'"
echo ""
read -p "Press Enter to continue to next test..."
echo ""

# Test 2: User Registration with CORS
echo "=========================================="
echo -e "${YELLOW}Test 2: User Registration with CORS${NC}"
echo "=========================================="
echo "Testing: POST http://localhost:8080/api/auth/register"
echo "Origin: http://localhost:3000"
echo ""

# Generate random username to avoid conflicts
RANDOM_USER="testuser_$RANDOM"

curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{\"username\":\"$RANDOM_USER\",\"password\":\"testpass123\"}" \
  -v 2>&1 | grep -E "(< HTTP|< Access-Control|< Content-Type|username|token)"
echo ""
echo "Expected CORS headers:"
echo "  - Access-Control-Allow-Origin: http://localhost:3000"
echo "  - Access-Control-Allow-Credentials: true"
echo ""
read -p "Press Enter to continue to next test..."
echo ""

# Test 3: OPTIONS Preflight Request (Login endpoint)
echo "=========================================="
echo -e "${YELLOW}Test 3: OPTIONS Preflight Request${NC}"
echo "=========================================="
echo "Testing: OPTIONS http://localhost:8080/api/auth/login"
echo "This simulates what browsers do before actual requests"
echo ""
curl -X OPTIONS http://localhost:8080/api/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -E "(< HTTP|< Access-Control)"
echo ""
echo "Expected CORS headers:"
echo "  - Access-Control-Allow-Origin: http://localhost:3000"
echo "  - Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"
echo "  - Access-Control-Allow-Headers: *"
echo ""
read -p "Press Enter to continue to next test..."
echo ""

# Test 4: Login with CORS
echo "=========================================="
echo -e "${YELLOW}Test 4: Login with CORS${NC}"
echo "=========================================="
echo "Testing: POST http://localhost:8080/api/auth/login"
echo "Using credentials from Test 2"
echo ""
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{\"username\":\"$RANDOM_USER\",\"password\":\"testpass123\"}" \
  -v 2>&1 | grep -E "(< HTTP|< Access-Control|username|token)"
echo ""
echo "Expected: Should see Access-Control-Allow-Origin header and JWT token in response"
echo ""
read -p "Press Enter to continue to next test..."
echo ""

# Test 5: CORS Rejection (Wrong Origin)
echo "=========================================="
echo -e "${YELLOW}Test 5: CORS Rejection Test (Security Check)${NC}"
echo "=========================================="
echo "Testing: POST from unauthorized origin (http://evil-site.com)"
echo "This should be REJECTED by CORS policy"
echo ""
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: http://evil-site.com" \
  -d "{\"username\":\"hacker\",\"password\":\"12345678\"}" \
  -v 2>&1 | grep -E "(< HTTP|< Access-Control|CORS)"
echo ""
echo "Expected: Should NOT see 'Access-Control-Allow-Origin: http://evil-site.com'"
echo "This confirms CORS is working and blocking unauthorized origins"
echo ""
read -p "Press Enter to see final summary..."
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}CORS Testing Complete!${NC}"
echo "=========================================="
echo ""
echo "Summary of what was tested:"
echo "  ✓ Health check with CORS headers"
echo "  ✓ User registration from allowed origin"
echo "  ✓ OPTIONS preflight requests"
echo "  ✓ User login from allowed origin"
echo "  ✓ CORS rejection for unauthorized origins"
echo ""
echo "Next Steps:"
echo "  1. Verify all tests showed proper Access-Control headers"
echo "  2. If any test failed, check Spring Boot console for errors"
echo "  3. Frontend (React) should now be able to connect from localhost:3000"
echo "  4. WebSocket connections should work from localhost:3000"
echo ""
echo "Configuration:"
echo "  - Allowed Origin: http://localhost:3000"
echo "  - Allowed Methods: GET, POST, PUT, DELETE, OPTIONS"
echo "  - Credentials: Enabled"
echo ""
