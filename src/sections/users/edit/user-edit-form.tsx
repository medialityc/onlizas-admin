"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/cards/card";
import { IUser } from "@/types/users";
import { UserFormHeader } from "./components/user-form-header";

interface UserUpdateFormProps {
  initialData?: Partial<IUser>;
}

/**
 * Stubbed UserEditForm: preserves export and props so other modules can import it,
 * but renders a read-only notice and header. The full edit UI has been disabled.
 */
const UserEditForm: React.FC<UserUpdateFormProps> = ({ initialData }) => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edición deshabilitada</CardTitle>
            <CardDescription>
              La edición de usuarios fue deshabilitada. Use la vista de detalles
              para ver y gestionar la información del usuario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserFormHeader
              title={
                (initialData as any)?.fullName ??
                (initialData as any)?.name ??
                "Usuario"
              }
              description={(initialData as any)?.email ?? ""}
            />
            <div className="py-4 text-sm text-muted-foreground">
              Interfaz de edición deshabilitada.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserEditForm;
