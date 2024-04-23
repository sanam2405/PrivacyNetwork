import { FC, ReactNode, createContext, useContext, useState } from "react";

interface Location {
  lat: number;
  long: number;
}

interface QLocationsContextType {
  qLocations: Location[];
  setQLocations: React.Dispatch<React.SetStateAction<Location[]>>;
}

const QLocationsContext = createContext<QLocationsContextType | undefined>(
  undefined,
);

export const useQLocations = () => {
  const context = useContext(QLocationsContext);
  if (!context) {
    throw new Error("useLocations must be used within a LocationsProvider");
  }
  return context;
};

export const QLocationsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [qLocations, setQLocations] = useState<Location[]>([]);

  return (
    <QLocationsContext.Provider value={{ qLocations, setQLocations }}>
      {children}
    </QLocationsContext.Provider>
  );
};
