// @ts-nocheck
import React, { useRef, useEffect, useState } from "react";

function highlightMatch(option: string, input: string) {
  if (!input) return option;
  const idx = option.toLowerCase().indexOf(input.toLowerCase());
  if (idx === -1) return option;
  const before = option.substring(0, idx);
  const match = option.substring(idx, idx + input.length);
  const after = option.substring(idx + input.length);
  return (
    <>
      {before}
      <span className="text-primary font-semibold">{match}</span>
      {after}
    </>
  );
}

type GooglePlacesAutocompleteProps = {
  apiKey: string;
  inputClassName?: string;
  optionClassName?: string;
  dropdownClassName?: string;
  countryCode?: string;
  placeholder?: string;
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  initialValue?: string;
};

function useGoogleMapsScript(
  apiKey: string,
  language?: string,
  libraries: string[] = ["places"]
) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // @ts-nocheck
    if (window.google && window.google.maps && window.google.maps.places) {
      setLoaded(true);
      return;
    }
    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => setLoaded(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "google-maps-script";
    const libs = libraries.join(",");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libs}${
      language ? `&language=${language}` : ""
    }`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, [apiKey, language, libraries]);

  return loaded;
}

export const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  apiKey,
  inputClassName = "",
  optionClassName = "",
  dropdownClassName = "",
  initialValue = "",
  countryCode,
  placeholder = "Escribe una dirección",
  onPlaceSelected,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState(initialValue);
  const [activeIndex, setActiveIndex] = useState(-1);

  const loaded = useGoogleMapsScript(apiKey, "es", ["places"]);
  const autocompleteService = useRef<google.maps.places.AutocompleteService>();
  const placesService = useRef<google.maps.places.PlacesService>();

  // Create hidden div for PlacesService (required for legacy getDetails)
  useEffect(() => {
    if (!loaded) return;
    if (!autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!placesService.current) {
      const mapDiv = document.createElement("div");
      mapDiv.style.display = "none";
      document.body.appendChild(mapDiv);
      placesService.current = new window.google.maps.places.PlacesService(mapDiv);
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded || !autocompleteService.current || !userInput) {
      setOptions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    autocompleteService.current.getPlacePredictions(
      {
        input: userInput,
        types: ["address"],
        componentRestrictions: countryCode
          ? { country: countryCode }
          : undefined,
      },
      (predictions) => {
        setLoading(false);
        if (predictions && predictions.length > 0) {
          setOptions(predictions);
          setShowDropdown(true);
        } else {
          setOptions([]);
          setShowDropdown(false);
        }
      }
    );
  }, [userInput, countryCode, loaded]);

  // Use legacy getDetails (100% compatible)
  const handleSelect = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    setShowDropdown(false);
    setUserInput(prediction.description);

    if (
      window.google &&
      window.google.maps &&
      window.google.maps.places &&
      placesService.current
    ) {
      placesService.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: [
            "name",
            "formatted_address",
            "address_component",
            "geometry",
            "place_id"
          ]
        },
        (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place
          ) {
            onPlaceSelected(place);
          } else {
            // fallback
            onPlaceSelected({
              place_id: prediction.place_id,
              name: prediction.description,
            } as google.maps.places.PlaceResult);
          }
        }
      );
    } else {
      // fallback
      onPlaceSelected({
        place_id: prediction.place_id,
        name: prediction.description,
      } as google.maps.places.PlaceResult);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || options.length === 0) return;
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, options.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < options.length) {
        handleSelect(options[activeIndex]);
        setActiveIndex(-1);
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    };
    if (showDropdown) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        className={`w-full ${inputClassName}`}
        placeholder={placeholder}
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
          setShowDropdown(true);
          setActiveIndex(-1);
        }}
        onFocus={() => {
          if (options.length > 0) setShowDropdown(true);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {showDropdown && (
        <ul
          className={`absolute left-0 right-0 z-10 mt-1 max-h-56 overflow-y-auto ${dropdownClassName}`}
        >
          {loading && (
            <li className={`${optionClassName} text-gray-400`}>Cargando...</li>
          )}
          {!loading &&
            options.map((option, idx) => (
              <li
                key={option.place_id}
                className={`${optionClassName} cursor-pointer ${
                  idx === activeIndex ? "bg-blue-100" : ""
                }`}
                onMouseDown={() => handleSelect(option)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
              {highlightMatch(option.description, userInput)}
              </li>
            ))}
          {!loading && options.length === 0 && (
            <li className={`${optionClassName} text-gray-400`}>
              Sin resultados
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;