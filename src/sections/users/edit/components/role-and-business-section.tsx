import { RHFAutocompleteWithAddButton } from "@/components/react-hook-form/rhf-autocomplete-with-add-button";
// import { getAllBusinesses } from "@/services/businesses";
import { getAllRoles } from "@/services/roles";
// import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";

interface RoleAndBusinessSectionProps {
  control: any;
  isSubmitting: boolean;
  onOpenRoleModal: () => void;
  onOpenBusinessModal: () => void;
}

export const RoleAndBusinessSection = ({
  isSubmitting,
  onOpenRoleModal,
  // onOpenBusinessModal,
}: RoleAndBusinessSectionProps) => (
  <>
    <RHFAutocompleteWithAddButton
      name="roles"
      label="Roles del Usuario"
      placeholder="Seleccionar roles..."
      objectValueKey="name"
      onFetch={getAllRoles}
      onOpenModal={onOpenRoleModal}
      multiple
      isSubmitting={isSubmitting}
      buttonColor="purple"
      queryKey="roles"
    />

    {/* <RHFAutocompleteWithAddButton
      name="businessIds"
      label="Empresas Asociadas"
      placeholder="Seleccionar los negocios"
      onFetch={getAllBusinesses}
      onOpenModal={onOpenBusinessModal}
      multiple
      isSubmitting={isSubmitting}
      buttonColor="purple"
      queryKey="roles"
      icon={
        <BuildingStorefrontIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      }
    /> */}
  </>
);
