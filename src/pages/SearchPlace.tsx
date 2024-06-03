import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { MapProvider } from '../context/MapContext';
import Map from '../components/Map';
import PlaceData from '../../types/PlaceData';
import '../index.css';
import axios from 'axios';

type DivisionsType = {
  전체: PlaceData[];
  음식점: PlaceData[];
  문화시설: PlaceData[];
  '축제 공연 행사': PlaceData[];
  관광지: PlaceData[];
  레포츠: PlaceData[];
  숙박: PlaceData[];
  쇼핑: PlaceData[];
};

const SearchPlace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('장소 보기');
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [initialCenter, setInitialCenter] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 37.2795,
    longitude: 127.0438,
  });
  const location = useLocation();
  const [divisions, setDivisions] = useState<DivisionsType>({
    전체: [],
    음식점: [],
    문화시설: [],
    '축제 공연 행사': [],
    관광지: [],
    레포츠: [],
    숙박: [],
    쇼핑: [],
  });

  const [activeDivision, setActiveDivision] =
    useState<keyof DivisionsType>('전체');

  const handleDivisionClick = (division: keyof DivisionsType) => {
    setActiveDivision(division);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get('q') || '';
    setSearchTerm(term);
  }, [location.search]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleResultsUpdate = (newPlaces: PlaceData[]) => {
    setPlaces(newPlaces);
    if (newPlaces.length > 0) {
      setInitialCenter({
        latitude: newPlaces[0].latitude,
        longitude: newPlaces[0].longitude,
      });
    }
  };

  const initialMarkers = places.map((place) => ({
    placeId: place.locationId,
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  const naviBack = () => {
    window.history.back();
  };

  return (
    <div className="w-full h-[90%] flex">
      <div className="w-1/2 h-full">
        <div className="h-[10%] w-full">
          <i
            className="absolute backArrow cursor-pointer h-[10%] w-[5%]"
            onClick={naviBack}
          ></i>
          <div className="w-full flex justify-center h-[10%]">
            <div className="w-5/6">
              <SearchBar curr={'main'} />
            </div>
          </div>
        </div>
        <div className="h-[8%] w-full flex justify-center">
          <div className="flex max-w-2xl mx-5 pt-4 w-[80%]">
            <div
              className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                activeTab === '장소 보기'
                  ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                  : 'border-b-2'
              }`}
              onClick={() => handleTabClick('장소 보기')}
            >
              장소 보기
            </div>
            <div
              className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                activeTab === '일정 보기'
                  ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                  : 'border-b-2'
              }`}
              onClick={() => handleTabClick('일정 보기')}
            >
              일정 보기
            </div>
          </div>
        </div>
        <div className="tab-content h-[82%] justify-between ">
          <div
            id="active-white-bg"
            className={activeTab === '장소 보기' ? 'active h-full w-full' : ''}
          >
            {activeTab === '장소 보기' && (
              <div className="flex flex-col">
                <div className="w-full whitespace-nowrap overflow-x-auto no-scrollbar flex justify-start xl:justify-center">
                  {(Object.keys(divisions) as Array<keyof DivisionsType>).map(
                    (division) => (
                      <button
                        key={division}
                        className={`py-1 px-2 m-1 border rounded-full ${
                          activeDivision === division
                            ? 'bg-main-red-color text-white'
                            : 'bg-white text-main-red-color'
                        }`}
                        onClick={() => handleDivisionClick(division)}
                      >
                        {division}
                      </button>
                    ),
                  )}
                </div>
                <div className="flex max-w-4xl justify-end w-full px-10">
                  <Link
                    to="/addplaceform"
                    className="text-ms text-main-green-color font-Nanum Gothic underline underline-offset-4"
                  >
                    장소 직접 추가하기
                  </Link>
                </div>
                <div className="flex-grow w-full h-[65vh]">
                  <SearchResults
                    tab={activeTab}
                    onResultsUpdate={handleResultsUpdate}
                    activeDivision={activeDivision}
                    divisions={divisions}
                    setDivisions={setDivisions}
                    setActiveDivision={setActiveDivision}
                  />
                </div>
              </div>
            )}
          </div>
          <div className={activeTab === '일정 보기' ? 'active' : ''}>
            {activeTab === '일정 보기' && (
              <div className="h-[90%]">
                <SearchResults
                  tab={activeTab}
                  onResultsUpdate={handleResultsUpdate}
                  activeDivision={activeDivision}
                  divisions={divisions}
                  setDivisions={setDivisions}
                  setActiveDivision={setActiveDivision}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <MapProvider
        key={JSON.stringify(initialMarkers)}
        initialCenter={initialCenter}
        initialMarkers={initialMarkers}
      >
        <Map />
      </MapProvider>
    </div>
  );
};

export default SearchPlace;
