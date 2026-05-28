# Q&A Platform — Project Specification

## 1. Concept & Vision

A semantic query-resolution and FAQ generation platform where users raise real-time queries, get peer/moderator/senior answers, and graduate high-quality content into an approved FAQ knowledge base — all governed by a QP (Quality Point) reputation economy and role-based access.

The feel: a calm, professional academic-tech internal tool. Think Linear meets Notion — minimal, structured, trustworthy.

## 2. Tech Stack

- **Frontend:** React + React Router + Axios, styled with Tailwind CSS (slate/gray palette)
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **RAG Engine:** Node.js pipeline with embedding + vector similarity
- **Auth:** JWT with refresh tokens, email OTP verification
- **Vector DB:** In-memory vector store (production can swap to Qdrant/Pinecone)

## 3. Directory Structure

```
qa-platform/
├── client/                     # React frontend
├── server/                     # Express backend
├── rag-engine/                 # RAG + similarity engine
├── shared/                     # Shared constants/enums
└── docs/                       # System documentation
```

## 4. Roles & Permissions

| Role       | Key Powers |
|------------|-----------|
| Student    | Ask, answer (1×/q), upvote, track own |
| Moderator  | + Approve answers, accept/reject questions, mark trendy |
| Senior     | + Create FAQ, convert RTQ→FAQ, delete any content |
| Admin      | + Manage whitelist, assign roles, revoke users |

## 5. QP System

### Earning
- Answer a question: +2 QP
- Answer approved by Moderator: +5 QP
- Answer approved by Senior: +5 QP
- Question accepted: +5 QP
- Question added to FAQ: +20 QP (questioner)
- Answer selected for FAQ: +10 QP bonus
- Moderator approves answer: +5 QP
- Moderator marks question accepted: +5 QP
- Senior answers: +5 QP
- Senior approves answer: +5 QP
- Senior converts RTQ→FAQ: +10 QP
- Senior creates new FAQ manually: +15 QP

### Penalties
- Duplicate FAQ match (F1): -5 QP
- F2+R1 match: -5 QP
- Answer removed by Senior: -3 QP
- Question removed: -5 QP

### Thresholds
- QP < 50: Cannot raise questions
- QP ≥ 500: Auto-request Moderator promotion

## 6. RAG Decision Tree

```
User Question → Embed → Compare with FAQ vectors + RTQ vectors

F1: FAQ similarity > 80%  → REJECT + -5 QP + upvote matched FAQ
F2: 50% < FAQ ≤ 80%:
  + R1: RTQ > 60%  → REJECT + -5 QP + upvote FAQ & RTQ
  + R2: 20% < RTQ ≤ 60%  → REJECT (no penalty)
  + R3: RTQ ≤ 20%  → ACCEPT → Add to RTQ
F3: FAQ ≤ 50%:
  + R1: RTQ > 60%  → REJECT (no penalty) + upvote RTQ
  + R2/R3: RTQ ≤ 60%  → ACCEPT → Add to RTQ
```

## 7. Pages

| # | Page | Access |
|---|------|--------|
| 0A | Login | Public |
| 0B | Signup | Public |
| 1A | Approved FAQs | All authenticated |
| 1B | Real-Time Queries (RTQ) | All authenticated |
| 2  | Student Dashboard | Student/Moderator |
| 3  | Senior Dashboard | Senior/Admin |
| 4A | Add New FAQ | Senior only |
| 4B | Raise Question | Student/Moderator |
| 5  | Profile | All authenticated |
| 6  | User List | All (filtered by role) |
| 7  | Track Questions | Student own |
| 8  | Working History | Student own |
| 9A | Notifications | Student |
| 9B | Notifications | Senior |

## 8. MongoDB Models

- **User** — name, username, email, password, role, qp, status, createdAt
- **Question** — userId, question, category, tags, status, answers[], createdAt
- **Answer** — questionId, userId, answer, upvotes, isApproved, approvedBy, isSelectedForFAQ
- **FAQ** — question, answer, category, tags, upvotes, createdBy, vectorEmbedding
- **RTQ** — question, category, tags, answers[], status, upvotes, vectorEmbedding
- **QPTransaction** — userId, type, amount, reason, referenceId
- **Notification** — userId, role, type, message, qpImpact, read

## 9. API Endpoints

### Auth
- `POST /api/auth/signup` — Register (sends OTP)
- `POST /api/auth/verify-otp` — Verify OTP → activate account
- `POST /api/auth/login` — Login → JWT
- `GET /api/auth/me` — Current user

### FAQ (Page 1A)
- `GET /api/faq` — List approved FAQs
- `POST /api/faq` — Create FAQ (Senior)
- `PUT /api/faq/:id` — Update FAQ (Senior)
- `DELETE /api/faq/:id` — Delete FAQ (Senior)
- `POST /api/faq/upvote/:id` — Upvote FAQ

### RTQ (Page 1B)
- `GET /api/rtq` — List RTQs
- `POST /api/rtq/question` — Submit question (goes through RAG)
- `POST /api/rtq/:id/answer` — Add answer
- `POST /api/rtq/answer/upvote/:answerId` — Upvote answer
- `PATCH /api/rtq/approve-answer/:answerId` — Approve answer (Moderator/Senior)
- `PATCH /api/rtq/mark-accepted/:id` — Mark question accepted (Moderator/Senior)
- `DELETE /api/rtq/:id` — Remove question (Senior)

### Questions (Page 7/Track)
- `GET /api/questions/user/:id` — User's questions
- `PATCH /api/questions/resolve/:id` — Mark resolved

### Users (Page 6)
- `GET /api/users` — User list
- `PATCH /api/users/role` — Assign role (Admin)
- `DELETE /api/users/:id` — Remove user (Admin)
- `PATCH /api/users/restrict/:id` — Revoke activity

### QP
- `GET /api/qp/my-score` — Current QP
- `GET /api/qp/history` — Transaction history
- `GET /api/leaderboard` — Ranked users

### Notifications (Page 9)
- `GET /api/notifications` — User notifications
- `PATCH /api/notifications/read/:id` — Mark read

### Admin
- `POST /api/admin/approve-user` — Approve signup
- `PATCH /api/admin/assign-role` — Assign role
- `GET /api/admin/pending-users` — Pending approvals

### RAG Engine
- `POST /api/rag/evaluate-question` — Main entry: embed + decision tree

## 10. Styling

- Background: `#f8fafc` (slate-50)
- Cards: white, border `#e5e7eb`, radius 10px, shadow `0 1px 2px rgba(0,0,0,0.04)`
- Primary button: `#0f172a` bg, white text, radius 10px
- Secondary button: white bg, border `#cbd5e1`
- Text: `#0f172a` primary, `#6b7280` muted
- Font: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Max content width: 1100px centered
- Spacing: 8/12/16/24/32px rhythm
- Focus: `box-shadow: 0 0 0 3px rgba(15,23,42,0.08)`
- Transitions: `0.2s ease` everywhere

## 11. Build Plan

Phase 1: Project scaffolding + shared constants + models
Phase 2: Auth system (signup, OTP, login, middleware)
Phase 3: Core API (FAQ, RTQ, questions, answers)
Phase 4: RAG engine + decision tree
Phase 5: QP service + notifications
Phase 6: React pages (auth + dashboard)
Phase 7: FAQ + RTQ pages + upvoting
Phase 8: Question raise + tracking
Phase 9: Profile + users + notifications
Phase 10: Final wiring + testing