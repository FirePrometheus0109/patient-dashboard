# Patient Dashboard Backend

A Node.js/Express backend with TypeScript for managing patient data using Firebase Firestore.

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── patient.controller.ts    # Patient business logic
│   ├── routes/
│   │   └── patient.routes.ts        # Patient API routes
│   ├── services/
│   │   └── firebase.ts              # Firebase configuration
│   └── index.ts                     # Main server file
├── package.json
├── tsconfig.json
├── .env                             # Environment variables (create this file)
└── README.md
```