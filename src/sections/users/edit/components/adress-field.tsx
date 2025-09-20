import { CardContent, Card } from "@/components/cards/card";
import { useCountry } from "@/hooks/use-country";
import { MapPinIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { AddressFormData } from "./user-schema";
import { Button } from "@/components/button/button";
import { useHasPermissions } from "@/auth-sso/permissions/hooks";
interface AdressFieldProps {
  field: AddressFormData;
  index: number;
  removeAddress: (index?: number | number[]) => void;
  handleEditAddress: (address: AddressFormData) => void;
}

const AdressField = ({
  field,
  index,
  handleEditAddress,
  removeAddress,
}: AdressFieldProps) => {
  const {
    country,
    loading: loadingCountry,
    flag,
  } = useCountry(field.countryId);

  // Control de permisos
  const hasUpdatePermission = useHasPermissions(["UPDATE_ALL"]);
  const hasDeletePermission = useHasPermissions(["DELETE_ALL"]);

  return (
    <Card
      key={field.id}
      className="border border-gray-200 hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold text-sm">
              {field.name || `Dirección ${index + 1}`}
            </h4>
          </div>
          <div className="flex gap-1">
            {hasUpdatePermission && (
              <Button
                type="button"
                outline
                size="sm"
                onClick={() => handleEditAddress(field)}
              >
                <PencilIcon className="h-3 w-3" />
              </Button>
            )}
            {hasDeletePermission && (
              <Button
                type="button"
                outline
                size="sm"
                onClick={() => removeAddress(index)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            {field.mainStreet} {field.number}
          </p>
          {field.otherStreets && <p>{field.otherStreets}</p>}
          <p>
            {field.city}, {field.state} {field.zipcode}
          </p>
          <p>
            {" "}
            {loadingCountry ? (
              <span className="h-10 bg-gray-200 rounded animate-pulse w-64"></span>
            ) : (
              <span className="flex  items-center gap-2">
                {country && flag ? (
                  <>
                    {flag} {country.name}
                  </>
                ) : (
                  "No disponible"
                )}
              </span>
            )}
          </p>
          {field.annotations && (
            <p className="text-xs italic mt-2">{field.annotations}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdressField;
