#!/usr/bin/env bash
# QUICK START - SVD Frontend Integration Demo
# Run this for immediate live demo

set -e

echo "🎬 SVD Frontend Integration - Quick Start Demo"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ROOT="/Users/sparkmachine/Tlamatini"

# Check if running from correct directory
if [ ! -d "$PROJECT_ROOT" ]; then
    echo -e "${RED}❌ Project root not found at $PROJECT_ROOT${NC}"
    exit 1
fi

# Start backend
echo -e "${BLUE}📊 Starting Backend (FastAPI)...${NC}"
cd "$PROJECT_ROOT/backend"

# Kill any existing process on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend in background
python -m uvicorn main:app --reload --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID, Port: 8000)${NC}"
sleep 3

# Start frontend server
echo -e "${BLUE}📱 Starting Frontend Server (HTTP)...${NC}"
cd "$PROJECT_ROOT/frontend"

# Kill any existing process on port 8001
lsof -ti:8001 | xargs kill -9 2>/dev/null || true
sleep 1

# Start frontend server in background
python -m http.server 8001 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID, Port: 8001)${NC}"
sleep 2

# Verify endpoints
echo ""
echo -e "${BLUE}🧪 Verifying Endpoints...${NC}"

# Test backend health
if curl -s http://localhost:8000/ > /dev/null; then
    echo -e "${GREEN}✅ Backend responding${NC}"
else
    echo -e "${RED}❌ Backend not responding${NC}"
    kill $BACKEND_PID
    exit 1
fi

# Test endpoint
RESPONSE=$(curl -s http://localhost:8000/matching/compare/E001)
if echo "$RESPONSE" | grep -q "comparativa"; then
    echo -e "${GREEN}✅ /matching/compare endpoint working${NC}"
else
    echo -e "${YELLOW}⚠️  /matching/compare response: $RESPONSE${NC}"
fi

# Test frontend
if curl -s http://localhost:8001/dashboard-estudiante.html > /dev/null; then
    echo -e "${GREEN}✅ Frontend responding${NC}"
else
    echo -e "${RED}❌ Frontend not responding${NC}"
    kill $BACKEND_PID $FRONTEND_PID
    exit 1
fi

echo ""
echo -e "${GREEN}================================================================${NC}"
echo -e "${GREEN}🚀 DEMO READY!${NC}"
echo -e "${GREEN}================================================================${NC}"
echo ""

# Display URLs
echo -e "${BLUE}📌 URLs:${NC}"
echo -e "   ${YELLOW}Dashboard:${NC} http://localhost:8001/dashboard-estudiante.html"
echo -e "   ${YELLOW}Demo UI:${NC}   http://localhost:8001/DEMO_SVD_UI.html"
echo -e "   ${YELLOW}API:${NC}       http://localhost:8000/docs"
echo ""

# Display test commands
echo -e "${BLUE}🧪 Test Commands:${NC}"
echo -e "   ${YELLOW}NLP Matches:${NC}"
echo -e "   curl http://localhost:8000/matching/E001 | jq"
echo ""
echo -e "   ${YELLOW}SVD Matches:${NC}"
echo -e "   curl http://localhost:8000/matching/svd/E001 | jq"
echo ""
echo -e "   ${YELLOW}Compare (NLP vs SVD):${NC}"
echo -e "   curl http://localhost:8000/matching/compare/E001 | jq"
echo ""

# Display what to do
echo -e "${BLUE}👉 Next Steps:${NC}"
echo -e "   1. Open in browser: ${YELLOW}http://localhost:8001/dashboard-estudiante.html${NC}"
echo -e "   2. Click [NLP] button - See matches with blue badges"
echo -e "   3. Click [SVD] button - See matches with purple badges"
echo -e "   4. Click [Comparar] - Opens modal with side-by-side comparison"
echo ""

# Display features
echo -e "${BLUE}✨ Features:${NC}"
echo -e "   • Toggle between NLP and SVD algorithms"
echo -e "   • See live badge changes (blue vs purple)"
echo -e "   • Compare scores side-by-side"
echo -e "   • View performance metrics (9.4% avg difference)"
echo ""

# Cleanup on exit
echo -e "${YELLOW}Press CTRL+C to stop both servers${NC}"
echo ""

# Handle interruption
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
while true; do
    sleep 1
done
