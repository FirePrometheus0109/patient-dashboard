import { Request, Response } from 'express';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import db from '../services/firebase';

// Patient interface to match the frontend model
interface IPatient {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  status: 'Inquiry' | 'Onboarding' | 'Active' | 'Churned';
  city: string;
  state: string;
  zipCode: string;
}

export class PatientController {
  /**
   * Create a new patient
   */
  static async createPatient(req: Request, res: Response): Promise<void> {
    try {
      const patientData = req.body as IPatient;
      
      // Validate required fields
      if (!patientData.firstName || !patientData.lastName || !patientData.dob || !patientData.status) {
        res.status(400).json({ 
          error: 'Missing required fields: firstName, lastName, dob, and status are required' 
        });
        return;
      }

      // Validate status enum
      const validStatuses = ['Inquiry', 'Onboarding', 'Active', 'Churned'];
      if (!validStatuses.includes(patientData.status)) {
        res.status(400).json({ 
          error: 'Invalid status. Must be one of: Inquiry, Onboarding, Active, Churned' 
        });
        return;
      }

      const docRef = await addDoc(collection(db, 'patients'), patientData);
      res.status(201).json({ 
        id: docRef.id,
        message: 'Patient created successfully'
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(500).json({ error: 'Failed to create patient' });
    }
  }

  /**
   * Get all patients with pagination and sorting
   */
  static async getAllPatients(req: Request, res: Response): Promise<void> {
    try {
      // Get query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string || 'firstName';
      const sortOrder = req.query.sortOrder as string || 'asc';
      const search = req.query.search as string || '';

      // Validate pagination parameters
      if (page < 1) {
        res.status(400).json({ error: 'Page must be greater than 0' });
        return;
      }
      if (limit < 1 || limit > 100) {
        res.status(400).json({ error: 'Limit must be between 1 and 100' });
        return;
      }

      // Get all patients from Firebase
      const snapshot = await getDocs(collection(db, 'patients'));
      let patients = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as (IPatient & { id: string })[];
      
      // Apply search filter if provided
      if (search) {
        const searchLower = search.toLowerCase();
        patients = patients.filter(patient => 
          patient.firstName.toLowerCase().includes(searchLower) ||
          patient.lastName.toLowerCase().includes(searchLower) ||
          patient.middleName?.toLowerCase().includes(searchLower) ||
          patient.city.toLowerCase().includes(searchLower) ||
          patient.state.toLowerCase().includes(searchLower) ||
          patient.status.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      patients.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'name':
            aValue = `${a.firstName} ${a.middleName || ''} ${a.lastName}`.toLowerCase();
            bValue = `${b.firstName} ${b.middleName || ''} ${b.lastName}`.toLowerCase();
            break;
          case 'dob':
            aValue = new Date(a.dob).getTime();
            bValue = new Date(b.dob).getTime();
            break;
          case 'status':
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
            break;
          case 'location':
            aValue = `${a.city} ${a.state} ${a.zipCode}`.toLowerCase();
            bValue = `${b.city} ${b.state} ${b.zipCode}`.toLowerCase();
            break;
          default:
            aValue = a[sortBy as keyof IPatient] || '';
            bValue = b[sortBy as keyof IPatient] || '';
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      // Calculate pagination
      const totalPatients = patients.length;
      const totalPages = Math.ceil(totalPatients / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPatients = patients.slice(startIndex, endIndex);

      // Validate page number
      if (page > totalPages && totalPages > 0) {
        res.status(400).json({ error: 'Page number exceeds total pages' });
        return;
      }
      
      res.json({
        patients: paginatedPatients,
        pagination: {
          currentPage: page,
          totalPages,
          totalPatients,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        },
        message: 'Patients retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ error: 'Failed to fetch patients' });
    }
  }

  /**
   * Get a single patient by ID
   */
  static async getPatientById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ error: 'Patient ID is required' });
        return;
      }

      const snapshot = await getDocs(collection(db, 'patients'));
      const patients = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as (IPatient & { id: string })[];
      
      const patient = patients.find(p => p.id === id);

      if (!patient) {
        res.status(404).json({ error: 'Patient not found' });
        return;
      }

      res.json({
        patient,
        message: 'Patient retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ error: 'Failed to fetch patient' });
    }
  }

  /**
   * Update a patient
   */
  static async updatePatient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body as IPatient;

      if (!id) {
        res.status(400).json({ error: 'Patient ID is required' });
        return;
      }

      // Validate required fields
      if (!updateData.firstName || !updateData.lastName || !updateData.dob || !updateData.status) {
        res.status(400).json({ 
          error: 'Missing required fields: firstName, lastName, dob, and status are required' 
        });
        return;
      }

      // Validate status enum
      const validStatuses = ['Inquiry', 'Onboarding', 'Active', 'Churned'];
      if (!validStatuses.includes(updateData.status)) {
        res.status(400).json({ 
          error: 'Invalid status. Must be one of: Inquiry, Onboarding, Active, Churned' 
        });
        return;
      }

      // Convert to plain object for Firebase
      const firebaseData = {
        firstName: updateData.firstName,
        middleName: updateData.middleName,
        lastName: updateData.lastName,
        dob: updateData.dob,
        status: updateData.status,
        city: updateData.city,
        state: updateData.state,
        zipCode: updateData.zipCode
      };

      await updateDoc(doc(db, 'patients', id), firebaseData);
      res.json({ 
        message: 'Patient updated successfully',
        id
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      res.status(500).json({ error: 'Failed to update patient' });
    }
  }

  /**
   * Delete a patient
   */
  static async deletePatient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Patient ID is required' });
        return;
      }

      await deleteDoc(doc(db, 'patients', id));
      res.json({ 
        message: 'Patient deleted successfully',
        id
      });
    } catch (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ error: 'Failed to delete patient' });
    }
  }

} 