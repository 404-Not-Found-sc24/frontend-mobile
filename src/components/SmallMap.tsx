import React, { useEffect, useState } from 'react';
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

const SmallMap: React.FC<MapProps> = ({ latitude, longitude }) => {


    useEffect(() => {
        console.log("api: ", process.env.REACT_APP_KAKAO_MAP_API_KEY)
        if (window.kakao && window.kakao.maps) {
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
        }
    }, [latitude, longitude]);
    return <div id="map" className="w-[80%] h-full"></div>;
};

export default SmallMap;
