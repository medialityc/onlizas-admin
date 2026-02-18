"use client";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";

interface EditableAddressProps {
  title: string;
  address: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  value: string;
}

export function EditableAddress({
  title,
  address,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  value,
}: EditableAddressProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            Editar
          </Button>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Dirección del ${title.toLowerCase().replace("dirección de ", "")}`}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={onSave}>
              Guardar
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm">{address}</p>
      )}
    </div>
  );
}
