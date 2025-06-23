import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';

const router = Router();

// Patient routes
router.post('/', PatientController.createPatient);
router.get('/', PatientController.getAllPatients);
router.get('/:id', PatientController.getPatientById);
router.put('/:id', PatientController.updatePatient);
router.delete('/:id', PatientController.deletePatient);

export default router;