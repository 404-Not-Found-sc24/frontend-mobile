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
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    setIsLoaded(true);
                });
            } else {
                console.error('Kakao Maps API script not loaded');
            }
        };

        if (!window.kakao || !window.kakao.maps) {
            const script = document.createElement('script');
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
            script.onload = () => loadKakaoMap();
            document.head.appendChild(script);
        } else {
            loadKakaoMap();
        }
    }, []);

    useEffect(() => {
        if (isLoaded) {
            const container = document.getElementById('map');
            if (container) {
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
        }
    }, [isLoaded, latitude, longitude]);

    return <div id="map" className="w-[80%] h-full"></div>;
};

export default SmallMap;
