import { DepartmentDetailsModal } from "./department-details-modal";
import { Department } from "@/types/departments";
import DepartmentModal from "./department-modal";

interface DepartmentsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  department?: Department;
  isDetailsView?: boolean;
}

export default function DepartmentsModalContainer({
  open,
  onClose,
  department,
  isDetailsView,
  onSuccess,
}: DepartmentsModalProps) {
  if (!open) return null;

  if (isDetailsView) {
    if (!department) return null;
    return (
      <DepartmentDetailsModal
        loading={false}
        onClose={onClose}
        open={open}
        department={department}
      />
    );
  }

  return (
    <DepartmentModal
      loading={false}
      onClose={onClose}
      open={open}
      department={department}
      onSuccess={onSuccess}
    />
  );
}
