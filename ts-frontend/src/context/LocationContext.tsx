import { FC, ReactNode, createContext, useContext, useState } from "react";

interface Location {
  userId: string;
  lat: number;
  lng: number;
}

interface LocationsContextType {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  locationsUserIdSet: Set<string>;
  setLocationsUserIdSet: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const LocationsContext = createContext<LocationsContextType | undefined>(
  undefined,
);

export const useLocations = () => {
  const context = useContext(LocationsContext);
  if (!context) {
    throw new Error("useLocations must be used within a LocationsProvider");
  }
  return context;
};

export const LocationsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsUserIdSet, setLocationsUserIdSet] = useState<Set<string>>(
    new Set(),
  );

  return (
    <LocationsContext.Provider
      value={{
        locations,
        setLocations,
        locationsUserIdSet,
        setLocationsUserIdSet,
      }}
    >
      {children}
    </LocationsContext.Provider>
  );
};
