import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CitySearchBar from '../components/CitySearchBar';

const Travledes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const curr = { ...location.state };

  const navigateToSearchTravelmajor = (city: string, city2: string) => {
    navigate('/searchtraveldes', {
      state: {
        city: city,
        city2: city2,
        curr: curr.curr,
      },
    });
  };

  const navigateToSearchTravel = (city: string) => {
    navigate('/searchtraveldes', {
      state: {
        city: city,
        curr: curr.curr,
      },
    });
  };

  const cities = [
    "경기도", "강원도", "충청북도", "충청남도", "경상북도", "경상남도", "전라북도", "전라남도", "제주도"
  ]

  return (
    <div>
      <div className="w-full flex justify-center my-10">
        <div className="w-2/3 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
          <CitySearchBar />
        </div>
      </div>
      <div className="w-4/5 container mx-auto sm:my-6 md:my-12 lg:my-16 xl:my-20 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        <button
          className="relative flex flex-col w-full aspect-square"
          onClick={() => navigateToSearchTravelmajor('광역시', '특별')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/광역시.jpg'}
            alt="서울, 광역시 이미지"
            className="w-full h-full rounded-4 object-cover"
          />
          <div className="absolute bottom-0 right-0 text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            서울, 광역시
          </div>
        </button>
        {cities.map((city: string, index) => (
          <button
            key={index}
            className="relative flex flex-col w-full aspect-square"
            onClick={() => navigateToSearchTravel(city)}
          >
            <img
              src={process.env.PUBLIC_URL + `/image/${city}.jpg`}
              alt={`${city} 이미지`}
              className="w-full h-full rounded-4 object-cover"
            />
            <div className="absolute bottom-0 right-0 text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
              {city}
            </div>
          </button>
        ))}

      </div>
    </div>
  );
};

export default Travledes;
