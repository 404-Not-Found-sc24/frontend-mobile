import React, { useCallback, useEffect, useState } from 'react';
import MakeTrip from './MakeTrip';
import CitySearchBar from '../components/CitySearchBar';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface CityData {
  cityName: string;
  cityDetail: string;
  imageUrl: string;
}

const SearchTravelDes: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState('');
  const [cityDetail, setCityDetail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [placeSearchResults, setPlaceSearchResults] = useState<CityData[]>([]);
  const location = useLocation();
  const cityparam = { ...location.state };
  const [curr, setCurr] = useState('');
  const { accessToken, refreshAccessToken } = useAuth();

  const handleOpenModal = useCallback(
    (city: string, cityDetail: string, imageUrl: string) => {
      setIsOpen(true);
      setCity(city);
      setCityDetail(cityDetail);
      setImageUrl(imageUrl);
    },
    [],
  );

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setCity('');
  }, []);

  useEffect(() => {
    const cityparam = { ...location.state };
    setCurr(cityparam.curr);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const searchTerm = queryParams.get('q') || '';
      const cityparam = { ...location.state };

      if (searchTerm) {
        try {
          // 장소 데이터 가져오기
          const placeResponse = await axios.get(
            `/tour/city?keyword=${searchTerm}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          setPlaceSearchResults(placeResponse.data);
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        }
      } else if (cityparam) {
        try {
          // 장소 데이터 가져오기
          const placeResponse = await axios.get(
            '/tour/city?keyword=' +
              cityparam.city +
              '&keyword2=' +
              cityparam.city2,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          setPlaceSearchResults(placeResponse.data);
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        }
      } else {
        setPlaceSearchResults([]);
      }
    };

    fetchData();
  }, [location.search]);

  return (
    console.log('curr: ', curr),
    console.log('res', placeSearchResults),
    (
      <div>
        <div className="w-full flex justify-center my-10">
          <div className="w-2/3 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
            <CitySearchBar />
          </div>
        </div>
        <div className="w-4/5 container mx-auto sm:my-6 md:my-12 lg:my-12 xl:my-20 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {curr === 'schedule' &&
            placeSearchResults.map((place: CityData, index) => (
              <button
                key={index}
                className="relative flex flex-col w-full aspect-square"
                onClick={() =>
                  handleOpenModal(
                    place.cityName,
                    place.cityDetail,
                    place.imageUrl,
                  )
                }
              >
                <img
                  src={place.imageUrl}
                  alt={place.cityName + '이미지'}
                  className="w-full h-full rounded-4 object-cover"
                />
                <div className="absolute bottom-0 right-0 text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
                  {place.cityName}
                </div>
              </button>
            ))}
          {curr === 'tour' &&
            placeSearchResults.map((place: CityData, index) => (
              <Link
                to={`/searchplace?city=${place.cityName}`}
                key={index}
                className="relative flex flex-col w-full aspect-square"
              >
                <img
                  src={place.imageUrl}
                  alt={place.cityName + '이미지'}
                  className="w-full h-full rounded-4 object-cover"
                />
                <div className="absolute bottom-0 right-0 text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
                  {place.cityName}
                </div>
              </Link>
            ))}
        </div>
        <MakeTrip
          isOpen={isOpen}
          city={city}
          cityDetail={cityDetail}
          imageUrl={imageUrl}
          handleCloseModal={handleCloseModal}
        />
      </div>
    )
  );
};

export default SearchTravelDes;
