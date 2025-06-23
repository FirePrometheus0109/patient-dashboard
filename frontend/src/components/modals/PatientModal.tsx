import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import PatientForm from '../forms/PatientForm';
import type { IPatient } from '../../types/patient.model';

interface PatientModalProps {
  patient?: IPatient;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PatientModal({ patient, onClose, onSuccess }: PatientModalProps) {
  const isEditing = !!patient;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {isEditing ? `Edit Patient: ${patient!.firstName} ${patient!.lastName}` : 'Add Patient'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PatientForm
          patient={patient}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </CardContent>
    </Card>
  );
} 