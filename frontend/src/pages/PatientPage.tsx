import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../config/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import PatientModal from '../components/modals/PatientModal';
import PatientTable from '../components/tables/PatientTable';
import { ConfirmDialog } from '../components/ui/confirm-dialog';
import type { IPatient } from '../types/patient.model';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPatients: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PatientsResponse {
  patients: IPatient[];
  pagination: PaginationInfo;
  message: string;
}

export default function PatientList() {
  const [editingPatient, setEditingPatient] = useState<IPatient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<{ id: string; name: string } | null>(null);
  
  const queryClient = useQueryClient();

  const { data: response, isLoading, error } = useQuery<PatientsResponse>({
    queryKey: ['patients', currentPage, itemsPerPage, sortField, sortDirection],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(sortField && { sortBy: sortField }),
        ...(sortDirection && { sortOrder: sortDirection })
      });
      
      const res = await api.get(`/patients?${params}`);
      return res.data;
    },
    retry: 1,
  });

  const patients = response?.patients || [];
  const pagination = response?.pagination;

  const handleDeleteClick = (patientId: string, patientName: string) => {
    setPatientToDelete({ id: patientId, name: patientName });
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;

    try {
      setDeletingPatientId(patientToDelete.id);
      await api.delete(`/patients/${patientToDelete.id}`);
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      
      // Show success toast
      toast.success(`${patientToDelete.name} deleted successfully!`);
    } catch (error) {
      console.error('Error deleting patient:', error);
      
      // Show error toast
      toast.error('Failed to delete patient. Please try again.');
    } finally {
      setDeletingPatientId(null);
      setShowDeleteDialog(false);
      setPatientToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setPatientToDelete(null);
  };

  const handleEdit = (patient: IPatient) => {
    setEditingPatient(patient);
  };

  const handleCloseEdit = () => {
    setEditingPatient(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Patient List</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddModal(true)}
              >
                <Plus/>
                Add Patient
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="h-full">
            <PatientTable
              patients={patients}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              deletingPatientId={deletingPatientId}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onSort={handleSort}
              currentSortField={sortField}
              currentSortDirection={sortDirection}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        description={`Are you sure you want to delete ${patientToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <PatientModal 
              onClose={() => setShowAddModal(false)} 
              onSuccess={() => {
                setShowAddModal(false);
                setTimeout(() => {
                  queryClient.invalidateQueries({ queryKey: ['patients'] });
                }, 100);
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <PatientModal
              patient={editingPatient}
              onClose={handleCloseEdit}
              onSuccess={() => {
                handleCloseEdit();
                setTimeout(() => {
                  queryClient.invalidateQueries({ queryKey: ['patients'] });
                }, 100);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}