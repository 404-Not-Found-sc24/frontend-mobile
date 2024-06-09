import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';

declare global {
    interface Window {
        kakao: any;
    }
}

interface MapProps {
    latitude: number;
    longitude: number;
}

const SmallMap: React.FC<MapProps> = ({latitude, longitude}) => {

    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3
        };
    
        const map = new window.kakao.maps.Map(container, options);

        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);

        const marker = new window.kakao.maps.Marker({
            position: markerPosition
        });

        marker.setMap(map);
      }, []);

    return <div id="map" className="w-[80%] h-full"></div>;
};

export default SmallMap;
