"use client";

import Badge from "@/components/badge/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import SimpleModal from "@/components/modal/modal";
import TabsWithIcons from "@/components/tab/tabs";
import { IUser } from "@/types/users";
import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface UserDetailsModalProps {
  user: IUser;
  open: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({
  user,
  open,
  onClose,
}: UserDetailsModalProps) {
  console.log(user);
  return (
    <SimpleModal
      title={
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {user.name}
            </h2>
          </div>
        </div>
      }
      open={open}
      onClose={onClose}
    >
      <TabsWithIcons
        tabs={[
          {
            label: "General",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <UserIcon className="h-5 w-5" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Nombre Completo
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {user.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={user.isVerified ? "primary" : "secondary"}
                        className="text-xs flex items-center gap-1 p-2"
                      >
                        {user.isVerified ? (
                          <>
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Verificado
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            No verificado
                          </>
                        )}
                      </Badge>
                      {user.isBlocked && (
                        <Badge variant="danger" className="text-xs p-2">
                          Bloqueado
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {user.apiRole}
                      </Badge>
                    </div>
                  </div>

                  {user.attributes &&
                    Object.keys(user.attributes)?.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                          Atributos Adicionales
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(user.attributes).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            ),
          },
          {
            label: "Contacto",
            content: (
              <div className="grid grid-cols-1  gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      {/* <MailIc className="h-5 w-5" /> */}
                      Emails ({user.emails.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.emails.length > 0 ? (
                      <div className="space-y-3">
                        {user.emails.map((email, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {email.address}
                            </span>
                            <Badge
                              variant={
                                email.isVerified ? "success" : "secondary"
                              }
                              className="text-xs"
                            >
                              {email.isVerified ? "Verificado" : "Pendiente"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        No hay emails registrados
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <PhoneIcon className="h-5 w-5" />
                      Teléfonos ({user.phones.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.phones.length > 0 ? (
                      <div className="space-y-3">
                        {user.phones.map((phone, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {phone.number}
                            </span>
                            <Badge
                              variant={
                                phone.isVerified ? "success" : "secondary"
                              }
                              className="text-xs"
                            >
                              {phone.isVerified ? "Verificado" : "Pendiente"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        No hay teléfonos registrados
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            label: "Direcciones",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <MapPinIcon className="h-5 w-5" />
                    Direcciones ({user.addresses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {user.addresses.map((address, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {address.name}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {address.country}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>
                              {address.mainStreet} {address.number}
                            </p>
                            {address.otherStreets && (
                              <p>{address.otherStreets}</p>
                            )}
                            <p>
                              {address.city}, {address.state} {address.zipcode}
                            </p>
                            {address.annotations && (
                              <p className="italic mt-2">
                                Notas: {address.annotations}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                            <span>Lat: {address.latitude}</span>
                            <span>Lng: {address.longitude}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No hay direcciones registradas
                    </p>
                  )}
                </CardContent>
              </Card>
            ),
          },
          {
            label: "Negocios",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <BuildingOffice2Icon className="h-5 w-5" />
                    Negocios ({user.businesses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.businesses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.businesses.map(business => (
                        <div
                          key={business.id}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {business.name}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="text-xs font-mono"
                            >
                              {business.code}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No hay negocios asociados
                    </p>
                  )}
                </CardContent>
              </Card>
            ),
          },
          {
            label: "Relaciones",
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <UsersIcon className="h-5 w-5" />
                      Beneficiarios ({user.beneficiaries.length})
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Usuarios que dependen de este usuario
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.beneficiaries.length > 0 ? (
                      <div className="space-y-3">
                        {user.beneficiaries.map(beneficiary => (
                          <div
                            key={beneficiary.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                                {beneficiary.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {beneficiary.emails?.[0]?.address ||
                                  "Sin email"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        No hay beneficiarios
                      </p>
                    )}
                  </CardContent>
                </Card>

                {user.benefactor && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <UserIcon className="h-5 w-5" />
                        Benefactor
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Usuario del cual depende
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {user.benefactor.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.benefactor.emails?.[0]?.address ||
                              "Sin email"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.benefactor.phones?.[0]?.number ||
                              "Sin teléfono"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ),
          },
          {
            label: "Seguridad",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <ShieldCheckIcon className="h-5 w-5" />
                    Roles y Permisos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Rol API
                      </label>
                      <Badge className="ml-2">{user.apiRole}</Badge>
                    </div>

                    {user.roles.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                          Roles Asignados ({user.roles.length})
                        </label>
                        <div className="space-y-2">
                          {user.roles.map(role => (
                            <div
                              key={role.id}
                              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                  {role.name}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  ID: {role.id}
                                </Badge>
                              </div>
                              {role.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {role.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </SimpleModal>
  );
}
