import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createLocation, updateLocation } from "@/services/locations";
import { ILocation } from "@/types/locations";
import { LocationFormData } from "../modals/locations-schema";

export const useLocationSubmit = (onSuccess?: (data?: ILocation) => void) => {
  const queryClient = useQueryClient();

  const submitLocation = async (
    data: LocationFormData, 
    location?: ILocation
  ) => {
    const submitData = {
      name: data.name,
      countryCode: data.countryCode,
      state: data.state,
      district: data.district,
      addressRaw: data.addressRaw,
      addressNormalized: data.addressNormalized || data.addressRaw || '',
      postalCode: data.postalCode || "",
      latitude: data.latitude,
      longitude: data.longitude,
      placeId: data.placeId || "",
      type: data.type,
      tags: data.tags,
      version: location ? (location.version || 0) : 1, // Incrementar versión al editar, 1 para nuevos
    };
    console.log(location?.version)
    console.log(submitData)
    const response = location 
      ? await updateLocation(location.id, submitData)
      : await createLocation(submitData);

    if (response.error) {
      throw new Error(response.message || 'Error al procesar la localización');
    }

    queryClient.invalidateQueries({ queryKey: ["locations"] });
    onSuccess?.(response.data);
    
    toast.success(
      location
        ? "Localización editada exitosamente"
        : "Localización creada exitosamente"
    );

    return response.data;
  };

  return { submitLocation };
};