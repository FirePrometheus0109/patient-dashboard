import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Edit, Trash, ChevronLeft, ChevronRight, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { IPatient } from '../../types/patient.model';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPatients: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PatientTableProps {
  patients: IPatient[] | [];
  onEdit: (patient: IPatient) => void;
  onDelete: (patientId: string, patientName: string) => void;
  deletingPatientId: string | null;
  isLoading?: boolean;
  pagination?: PaginationInfo;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
  onSort: (field: string) => void;
  currentSortField: string;
  currentSortDirection: 'asc' | 'desc';
}

export default function PatientTable({
  patients,
  onEdit,
  onDelete,
  deletingPatientId,
  isLoading = false,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onSort,
  currentSortField,
  currentSortDirection
}: PatientTableProps) {

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Onboarding':
        return 'secondary';
      case 'Inquiry':
        return 'outline';
      case 'Churned':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getSortIcon = (field: string) => {
    if (currentSortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return currentSortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <>
      <div className="border rounded-lg flex flex-col h-[calc(100vh-210px)]">
        <Table className='flex-1'>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="w-16 !text-center">No</TableHead>
              <TableHead
                className='!text-center cursor-pointer hover:bg-gray-50 transition-colors'
                onClick={() => onSort('name')}
              >
                <div className="flex items-center justify-center gap-1">
                  Name
                  {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead
                className='!text-center cursor-pointer hover:bg-gray-50 transition-colors'
                onClick={() => onSort('dob')}
              >
                <div className="flex items-center justify-center gap-1">
                  Date of Birth
                  {getSortIcon('dob')}
                </div>
              </TableHead>
              <TableHead
                className='!text-center cursor-pointer hover:bg-gray-50 transition-colors'
                onClick={() => onSort('status')}
              >
                <div className="flex items-center justify-center gap-1">
                  Status
                  {getSortIcon('status')}
                </div>
              </TableHead>
              <TableHead
                className='!text-center cursor-pointer hover:bg-gray-50 transition-colors'
                onClick={() => onSort('location')}
              >
                <div className="flex items-center justify-center gap-1">
                  Location
                  {getSortIcon('location')}
                </div>
              </TableHead>
              <TableHead className="!text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ) : !patients || patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              patients.map((p: IPatient, index: number) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-muted-foreground text-center">
                    {pagination ? (pagination.currentPage - 1) * pagination.limit + index + 1 : index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {p.firstName} {p.middleName || ''} {p.lastName}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(p.dob).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    {p.status ? (
                      <Badge variant={getStatusVariant(p.status)}>
                        {p.status}
                      </Badge>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {p.city && p.state && p.zipCode
                      ? `${p.city}, ${p.state} ${p.zipCode}`
                      : p.address || 'No address provided'
                    }
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        onClick={() => onEdit(p)}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                        title="Edit patient"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </span>
                      <span
                        onClick={() => onDelete(p.id!, `${p.firstName} ${p.lastName}`)}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                        title="Delete patient"
                      >
                        <Trash className="h-4 w-4 text-red-600" />
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPatients > 0 && (
        <div className="flex justify-end mt-4">
          <div className="flex justify-between w-1/15">
            <Select
              value={pagination.limit.toString()}
              onValueChange={onItemsPerPageChange}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <span
              onClick={() => pagination.hasPreviousPage && onPageChange(pagination.currentPage - 1)}
              className={`p-2 rounded-md cursor-pointer transition-colors ${!pagination.hasPreviousPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
                }`}
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </span>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNumber;
                if (pagination.totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNumber = pagination.totalPages - 4 + i;
                } else {
                  pageNumber = pagination.currentPage - 2 + i;
                }

                return (
                  <span
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer transition-colors ${pagination.currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    {pageNumber}
                  </span>
                );
              })}
            </div>

            <span
              onClick={() => pagination.hasNextPage && onPageChange(pagination.currentPage + 1)}
              className={`p-2 rounded-md cursor-pointer transition-colors ${!pagination.hasNextPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
                }`}
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      )}
    </>
  );
} 