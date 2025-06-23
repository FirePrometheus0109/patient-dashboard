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

## Architecture

The backend follows a clean architecture pattern with:

- **Controllers**: Handle business logic and data validation
- **Routes**: Define API endpoints and map them to controllers
- **Services**: External service configurations (Firebase)

## Environment Setup

### Required Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Getting Firebase Configuration

1. Go to your Firebase Console (https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Click on the web app or create a new one
7. Copy the configuration values to your `.env` file

### Example Firebase Config

Your Firebase config object looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBRN1dmUFV5tLwc1rzGePrEbIGtEHLZ_BM",
  authDomain: "patient-dashboard-b39ff.firebaseapp.com",
  projectId: "patient-dashboard-b39ff",
  storageBucket: "patient-dashboard-b39ff.firebasestorage.app",
  messagingSenderId: "431531905055",
  appId: "1:431531905055:web:3d8e4c548e66ff324e052a",
  measurementId: "G-JFD3V9MX6P"
};
```

Convert it to environment variables:
```env
FIREBASE_API_KEY=AIzaSyBRN1dmUFV5tLwc1rzGePrEbIGtEHLZ_BM
FIREBASE_AUTH_DOMAIN=patient-dashboard-b39ff.firebaseapp.com
FIREBASE_PROJECT_ID=patient-dashboard-b39ff
FIREBASE_STORAGE_BUCKET=patient-dashboard-b39ff.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=431531905055
FIREBASE_APP_ID=1:431531905055:web:3d8e4c548e66ff324e052a
FIREBASE_MEASUREMENT_ID=G-JFD3V9MX6P
```

## API Endpoints

### Patient Management

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/patients` | Create a new patient | Patient data | `{ id, message }` |
| `GET` | `/api/patients` | Get all patients | - | `{ patients, count, message }` |
| `GET` | `/api/patients/:id` | Get patient by ID | - | `{ patient, message }` |
| `PUT` | `/api/patients/:id` | Update patient | Patient data | `{ message, id }` |
| `DELETE` | `/api/patients/:id` | Delete patient | - | `{ message, id }` |
| `DELETE` | `/api/patients` | Delete all patients | - | `{ message, count }` |

### Patient Search & Filtering

| Method | Endpoint | Description | Query Parameters | Response |
|--------|----------|-------------|------------------|----------|
| `GET` | `/api/patients/search` | Search patients by name | `q` (search term) | `{ patients, count, searchTerm, message }` |
| `GET` | `/api/patients/status/:status` | Get patients by status | - | `{ patients, count, status, message }` |

## Patient Data Model

```typescript
interface IPatient {
  firstName: string;           // Required
  middleName?: string;         // Optional
  lastName: string;            // Required
  dob: string;                 // Required (YYYY-MM-DD format)
  status: 'Inquiry' | 'Onboarding' | 'Active' | 'Churned';  // Required
  city: string;                // Required
  state: string;               // Required
  zipCode: string;             // Required
}
```

## Validation Rules

### Required Fields
- `firstName`
- `lastName`
- `dob` (date of birth)
- `status`
- `city`
- `state`
- `zipCode`

### Status Values
- `Inquiry` - New patient inquiry
- `Onboarding` - Patient in onboarding process
- `Active` - Active patient
- `Churned` - Patient who has left

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include an `error` field with a descriptive message.

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add your Firebase configuration (see Environment Setup section above)

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Development

### Adding New Controllers

1. Create a new controller file in `src/controllers/`
2. Export a class with static methods for each operation
3. Add proper TypeScript interfaces for request/response types
4. Include validation and error handling

### Adding New Routes

1. Create route file in `src/routes/`
2. Import and use the corresponding controller
3. Define RESTful endpoints
4. Add to main server file if needed

## Testing

The API can be tested using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

Example curl commands:

```bash
# Get all patients
curl http://localhost:3001/api/patients

# Create a patient
curl -X POST http://localhost:3001/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "dob": "1990-01-01",
    "status": "Active",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }'

# Search patients
curl "http://localhost:3001/api/patients/search?q=john"

# Get patients by status
curl http://localhost:3001/api/patients/status/Active
```

## Security Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use different Firebase projects for development and production
- Regularly rotate your Firebase API keys
- Consider using Firebase Security Rules to restrict access to your Firestore database 