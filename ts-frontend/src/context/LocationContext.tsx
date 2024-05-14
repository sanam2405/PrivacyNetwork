import { FC, ReactNode, createContext, useContext, useState } from "react";

interface Location {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  college: string;
  lat: number;
  lng: number;
  dist_meters: number;
  Photo: string;
  mask: boolean;
}

interface QLocationsContextType {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  locationsUserIdSet: Set<string>;
  setLocationsUserIdSet: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const LocationsContext = createContext<QLocationsContextType | undefined>(
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
