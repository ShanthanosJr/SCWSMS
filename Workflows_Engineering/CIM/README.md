# CAM Compliance — MERN (v2)

Aligned to the **Compliance Inspection & Monitoring UI** document:
- Inspection Scheduling & Assignment
- Reports & Tracking (Compliance Trend + exports PDF/CSV)
- Alerts & Notifications (Upcoming/Overdue)
- Complaint Handling (manual + chatbot; types: Safety/Quality/Delay/Other)
- Monitoring Dashboard (compliance score & complaint stats)
- Login & Register (roles: Admin, Worker)

## Run

### Backend
```bash
cd backend
npm i
cp .env.example .env
npm run seed     # optional: demo data + default users
npm run dev
```

### Frontend
```bash
cd ../frontend
npm i
cp .env.example .env
npm run dev
```
Open the shown URL (usually http://localhost:5173). Default users:
- **admin / admin123** (role ADMIN)
- **worker / worker123** (role WORKER)

> For assignment simplicity, tokens are stored in localStorage.
