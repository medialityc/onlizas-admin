import SimpleModal from "@/components/modal/modal";
import { NotificationCreateForm } from "./notification-create-form";

interface NotificationCreateModalProps {
  open: boolean;
  onClose: () => void;
}

const NotificationCreateModal: React.FC<NotificationCreateModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <SimpleModal
      onClose={onClose}
      open={open}
      title={"Crea una nueva notificación"}
    >
      <NotificationCreateForm onClose={onClose} />
    </SimpleModal>
  );
};

export default NotificationCreateModal;
