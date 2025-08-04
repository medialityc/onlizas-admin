import React from "react";
import Swal from "sweetalert2";

interface SweetAlertProps {
  type?: number;
  buttonText?: string;
  className?: string;
  children?: React.ReactNode;
}

const SweetAlert: React.FC<SweetAlertProps> = ({
  type = 10,
  buttonText = "Confirm",
  className = "",
  children,
}) => {
  const showAlert = async () => {
    if (type === 10) {
      Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Delete",
        padding: "2em",
        customClass: { popup: "sweet-alerts" },
      }).then((result) => {
        if (result.value) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            customClass: { popup: "sweet-alerts" },
          });
        }
      });
    }
    // You can add more types/alerts here
  };

  return (
    <div className={`mb-5 ${className}`}>
      <div className="flex items-center justify-center">
        <button type="button" className="btn btn-success" onClick={showAlert}>
          {buttonText}
        </button>
      </div>
      {children}
    </div>
  );
};

export default SweetAlert;
