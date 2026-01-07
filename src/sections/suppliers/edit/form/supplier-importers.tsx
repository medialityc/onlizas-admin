import RHFMultiSelectImporters from "@/components/react-hook-form/rhf-multi-select-importers";
import { Paper, Title } from "@mantine/core";

interface SupplierImportersProps {
  initialImporterIds?: string[];
}

export default function SupplierImporters({
  initialImporterIds = [],
}: SupplierImportersProps) {
  return (
    <Paper p="md" radius="md" withBorder styles={{
      root: {
        backgroundColor: "light-dark(#ffffff, #1b2e4b)",
        borderColor: "light-dark(#e5e7eb, #253a54)",
      },
    }}>
      <Title order={3} className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Importadoras
      </Title>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Selecciona las importadoras con las que este proveedor tiene contratos.
      </p>
      <RHFMultiSelectImporters
        name="importersIds"
        label="Importadoras de la plataforma"
        placeholder="Seleccionar importadoras..."
      />
    </Paper>
  );
}
