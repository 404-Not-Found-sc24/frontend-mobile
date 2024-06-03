import React, { createContext, useState, useContext, useEffect } from 'react';

interface Marker {
  placeId: number;
  latitude: number;
  longitude: number;
}

interface MapContextType {
  markers: Marker[];
  centerPosition: { latitude: number; longitude: number };
  addMarker: (placeId: number, lat: number, lng: number) => void;
  removeMarker: (placeId: number) => void;
}

interface MapProviderProps {
  initialMarkers: Marker[];
  initialCenter: { latitude: number; longitude: number };
  children: React.ReactNode;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export const MapProvider: React.FC<MapProviderProps> = ({
                                                          initialMarkers,
                                                          initialCenter,
                                                          children,
                                                        }) => {
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers);
  const [centerPosition, setCenterPosition] = useState(initialCenter);

  const addMarker = (placeId: number, lat: number, lng: number) => {
    setMarkers((prevMarkers) => [...prevMarkers, { placeId, latitude: lat, longitude: lng }]);
  };

  const removeMarker = (placeId: number) => {
    setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.placeId !== placeId));
  };

  useEffect(() => {
    console.log(markers);
  }, [markers]);

  return (
      <MapContext.Provider value={{ markers, centerPosition, addMarker, removeMarker }}>
        {children}
      </MapContext.Provider>
  );
};
