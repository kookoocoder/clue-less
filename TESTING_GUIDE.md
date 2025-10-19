# 🧪 CipherTalk Testing Guide

## 🚀 Quick Start

Your dev server is running at: **http://localhost:3000**

---

## ✅ Feature Testing Checklist

### 1. Landing Page (`/`)
- [ ] Visit http://localhost:3000
- [ ] Verify gradient hero animation displays
- [ ] Check "Get Started" button links to `/login`
- [ ] Check "Try Puzzle Gate" button links to `/gate`
- [ ] Scroll through feature cards
- [ ] Verify responsive design on mobile/desktop

### 2. Login/Register (`/login`)
- [ ] Visit http://localhost:3000/login
- [ ] Toggle between "Sign In" and "Sign Up"
- [ ] Enter a handle (e.g., `@testuser`)
- [ ] Click "Create Passkey"
- [ ] Your browser should prompt for WebAuthn/passkey
- [ ] **Note**: WebAuthn requires HTTPS in production, or localhost in dev
- [ ] After registration, you'll be redirected to `/gate`

### 3. Puzzle Gate (`/gate`)
- [ ] Interactive chessboard loads with a puzzle
- [ ] Timer counts down from 60 seconds
- [ ] **Drag a piece** on the chessboard
- [ ] Move appears in the input field
- [ ] Try solving the puzzle:
  - For back-rank mate: Drag the rook to a8
  - For other puzzles: Follow the mate-in-1 requirement
- [ ] Click "Submit Solution"
- [ ] If correct: See success screen with unlock token
- [ ] Click "Go to Chat" to proceed
- [ ] Test "New Puzzle" button to fetch another

### 4. Chat Interface (`/chat`)
- [ ] Type a message in the input field
- [ ] Press Enter or click "Send 🔒"
- [ ] Message appears in a gradient bubble
- [ ] Timestamp shows correct time
- [ ] Read receipt (✓✓) displays
- [ ] Leave idle for 5 minutes
- [ ] Session lock overlay should appear
- [ ] Click "Solve Puzzle to Unlock" → redirects to gate

### 5. Profile Page (`/profile`)
- [ ] Visit http://localhost:3000/profile
- [ ] Verify handle displays correctly
- [ ] Check User ID and Device ID are shown
- [ ] Security status indicators show green checkmarks
- [ ] Click "Go to Chat" → redirects to chat
- [ ] Click "Solve New Puzzle" → redirects to gate
- [ ] Click "Sign Out" → clears session and redirects to home

---

## 🎮 Full User Journey Test

### Complete Flow (15 minutes)
1. Start at http://localhost:3000
2. Click "Get Started"
3. Register with handle `@alice`
4. Allow browser to create passkey
5. Redirected to puzzle gate
6. Solve the chess puzzle by dragging pieces
7. Get unlock token
8. Go to chat
9. Send 5 test messages
10. Visit profile page
11. Sign out
12. Try to sign in again with existing passkey
13. Verify session lock after 5 min idle

---

## 🧩 Chess Puzzle Solutions

Your database has 3 puzzles. Here are the solutions:

### Puzzle 1: Back-rank Mate
**FEN**: `6k1/5ppp/8/8/8/8/8/R6K w - - 0 1`  
**Target**: mate-in-1  
**Solution**: Drag white rook from a1 to a8 (Ra8#)

### Puzzle 2: King and Rook Endgame
**FEN**: `7k/R7/6K1/8/8/8/8/8 w - - 0 1`  
**Target**: mate-in-1  
**Solution**: Drag white rook from a7 to a8 (Ra8#)

### Puzzle 3: Rook on 8th Rank
**FEN**: `r4rk1/5ppp/8/8/8/8/5PPP/R4RK1 w - - 0 1`  
**Target**: mate-in-1  
**Solution**: Drag white rook from a1 to a8 (Rxa8#)

---

## 🔍 API Testing

### Test Puzzle Creation
```bash
curl -X POST http://localhost:3000/api/puzzle/create \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "id": "...",
  "kind": "chess",
  "spec": {
    "fen": "...",
    "target": "mate-in-1"
  },
  "nonce": "...",
  "expiresAt": 1234567890
}
```

### Test Puzzle Verification
```bash
curl -X POST http://localhost:3000/api/puzzle/verify \
  -H "Content-Type: application/json" \
  -d '{
    "fen": "6k1/5ppp/8/8/8/8/8/R6K w - - 0 1",
    "target": "mate-in-1",
    "moves": ["Ra8"],
    "deviceId": "test-device"
  }'
```

Expected response:
```json
{
  "ok": true,
  "unlockToken": "..."
}
```

---

## 🐛 Common Issues & Solutions

### Issue: WebAuthn not working
**Solution**: WebAuthn requires:
- HTTPS in production, OR
- localhost in development
- Modern browser (Chrome, Firefox, Safari, Edge)

### Issue: Chessboard doesn't load
**Solution**: Check browser console for errors. Try:
```bash
npm install react-chessboard chess.js
```

### Issue: Session lock doesn't trigger
**Solution**: Wait the full 5 minutes without moving mouse/keyboard

### Issue: "Database connection failed"
**Solution**: Check your `.env` file has valid `DATABASE_URL`

### Issue: Puzzles don't load
**Solution**: Re-run seed:
```bash
npm run prisma:seed
```

---

## 📊 Performance Checklist

- [ ] Page loads in < 2 seconds
- [ ] Chessboard renders smoothly
- [ ] Drag-and-drop is responsive
- [ ] No console errors
- [ ] Animations are smooth (60fps)
- [ ] Mobile responsive (test on phone)

---

## 🎨 Visual Checklist

- [ ] Dark theme throughout
- [ ] Emerald/cyan gradient accents
- [ ] Smooth hover effects
- [ ] Proper spacing and alignment
- [ ] Readable text contrast
- [ ] Consistent border radius
- [ ] Loading states display correctly

---

## 🔐 Security Testing

- [ ] No passwords stored anywhere
- [ ] Device ID stored in localStorage
- [ ] Session locks after inactivity
- [ ] Unlock tokens expire after use
- [ ] No plaintext messages in database
- [ ] Single device enforcement works

---

## 📱 Mobile Testing

If testing on mobile:
1. Get your local IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
2. Visit http://YOUR_IP:3000 on your phone
3. Test touch interactions on chessboard
4. Verify responsive layout
5. Test passkey on mobile browser

---

## ✅ Definition of Done

All features are complete when:
- ✅ All pages load without errors
- ✅ Interactive chessboard works
- ✅ Puzzles can be solved
- ✅ Session management works
- ✅ Chat UI displays messages
- ✅ Profile page shows user info
- ✅ No linter errors
- ✅ All tests pass (`npm test`)

---

## 🎉 Success Criteria

Your MVP is ready for demo when:
1. A user can register with a passkey
2. A user can solve a chess puzzle
3. A user can send chat messages
4. Session locks after 5 minutes
5. All pages are visually polished
6. No critical bugs

---

**Happy Testing!** 🚀

If you find any issues, check the browser console for error messages.

