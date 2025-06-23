import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import patientRoutes from "./routes/patient.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/patients", patientRoutes);

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));