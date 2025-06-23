import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { api } from '../../config/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ValidationError from '../../validations/ValidationError';
import { patientFormSchema, type PatientFormData } from '../../validations/patient.validation';
import type { IPatient } from '../../types/patient.model';

interface PatientFormProps {
  patient?: IPatient;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PatientForm({ patient, onClose, onSuccess }: PatientFormProps) {
  const isEditing = !!patient;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: patient?.firstName || '',
      middleName: patient?.middleName || '',
      lastName: patient?.lastName || '',
      dob: patient?.dob || '',
      status: (patient?.status as any) || '',
      street: patient?.address || '',
      city: patient?.city || '',
      state: patient?.state || '',
      zipCode: patient?.zipCode || ''
    }
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      // Map street to address for API compatibility
      const apiData = {
        ...data,
        address: data.street
      };
      delete (apiData as any).street;

      if (isEditing) {
        await api.put(`/patients/${patient!.id}`, apiData);
      } else {
        await api.post('/patients', apiData);
      }
      
      // Show success toast
      toast.success(`Patient ${isEditing ? 'updated' : 'added'} successfully!`);
      
      // Reset form only for adding new patients
      if (!isEditing) {
        reset();
      }
      
      onSuccess();
    } catch (error: any) {
      let errorMessage = `Error ${isEditing ? 'updating' : 'adding'} patient. Please try again.`;
      
      if (error.response?.data?.error) {
        errorMessage = `Server error: ${error.response.data.error}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if the backend is running.';
      }
      
      // Show error toast
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="firstName"
                disabled={isSubmitting}
                className={errors.firstName ? "border-red-500" : ""}
              />
            )}
          />
          <ValidationError error={errors.firstName?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name (optional)</Label>
          <Controller
            name="middleName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="middleName"
                disabled={isSubmitting}
                className={errors.middleName ? "border-red-500" : ""}
              />
            )}
          />
          <ValidationError error={errors.middleName?.message} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="lastName"
                disabled={isSubmitting}
                className={errors.lastName ? "border-red-500" : ""}
              />
            )}
          />
          <ValidationError error={errors.lastName?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth *</Label>
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="dob"
                type="date"
                disabled={isSubmitting}
                className={errors.dob ? "border-red-500 !block" : "!block"}
              />
            )}
          />
          <ValidationError error={errors.dob?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className={`!bg-transparent !border-gray-200 ${errors.status ? "!border-red-500" : ""}`}>
                <SelectValue
									placeholder="Select patient status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inquiry">Inquiry</SelectItem>
                <SelectItem value="Onboarding">Onboarding</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <ValidationError error={errors.status?.message} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="street">Street*</Label>
        <Controller
          name="street"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="street"
              disabled={isSubmitting}
              className={errors.street ? "border-red-500" : ""}
            />
          )}
        />
        <ValidationError error={errors.street?.message} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="city"
                disabled={isSubmitting}
                className={errors.city ? "border-red-500" : ""}
              />
            )}
          />
          <ValidationError error={errors.city?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State/Province *</Label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="state"
                disabled={isSubmitting}
                className={errors.state ? "border-red-500" : ""}
              />
            )}
          />
          <ValidationError error={errors.state?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip/Postal Code *</Label>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="zipCode"
                disabled={isSubmitting}
                className={errors.zipCode ? "border-red-500" : ""}
              />
            )}
          />
          <ValidationError error={errors.zipCode?.message} />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button 
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-6 bg-blue-600 hover:bg-blue-700 w-24"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="px-6 bg-blue-600 hover:bg-blue-700 w-24"
        >
          {isSubmitting ? (
            isEditing ? 'Updating...' : 'Adding...'
          ) : (
            <>
              {isEditing ? 'Update' : 'Add'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 