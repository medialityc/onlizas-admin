import SimpleModal from "@/components/modal/modal";
import UserCreateForm from "./user-create-form";

interface UserCreateModalProps {
  open: boolean;
  onClose: () => void;
}

const UserCreateModal: React.FC<UserCreateModalProps> = ({ open, onClose }) => {
  return (
    <SimpleModal onClose={onClose} open={open} title={"Crea un nuevo usuario"}>
      <UserCreateForm onSuccess={onClose} />
    </SimpleModal>
  );
};

export default UserCreateModal;
