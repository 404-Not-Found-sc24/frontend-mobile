import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import PlaceData from '../../types/PlaceData';

interface PlanData {
  scheduleId: string;
  name: string;
  startDate: string;
  endDate: string;
  userName: string;
  imageUrl: string;
}

type DivisionsType = {
  '전체': PlaceData[];
  '음식점': PlaceData[];
  '문화시설': PlaceData[];
  '축제 공연 행사': PlaceData[];
  '관광지': PlaceData[];
  '레포츠': PlaceData[];
  '숙박': PlaceData[];
  '쇼핑': PlaceData[];
};


interface Props {
  tab: string;
  onResultsUpdate: (newPlaces: PlaceData[]) => void;
  activeDivision: keyof DivisionsType;
  setActiveDivision: React.Dispatch<React.SetStateAction<keyof DivisionsType>>;
  divisions: DivisionsType;
  setDivisions: React.Dispatch<React.SetStateAction<DivisionsType>>;
}

const SearchResults: React.FC<Props> = ({ tab, onResultsUpdate, activeDivision, setActiveDivision, divisions, setDivisions }) => {
  const [planSearchResults, setPlanSearchResults] = useState<PlanData[]>([]);
  const [lastPlaceIdx, setLastPlaceIdx] = useState<Record<keyof DivisionsType, number>>({
    '전체': 0,
    '음식점': 0,
    '문화시설': 0,
    '축제 공연 행사': 0,
    '관광지': 0,
    '레포츠': 0,
    '숙박': 0,
    '쇼핑': 0,
  });
  const placeLoadMoreRef = useRef<HTMLDivElement>(null);
  const planLoadMoreRef = useRef<HTMLDivElement>(null);
  const placeObserver = useRef<IntersectionObserver | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';
  const city = queryParams.get('city') || '';

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPlaceDataOnScroll = async (division: keyof DivisionsType) => {
      try {
        const currDivision = division === '전체' ? '' : division;
        const placeResponse = await axios.get(
          `/tour/locations?city=${city}&keyword=${searchTerm}&lastIdx=${lastPlaceIdx[division]}&division=${currDivision}`,
        );

        const newPlaceResults = [...divisions[division], ...placeResponse.data];
        const newLastPlaceIdx = placeResponse.data.length < 20 ? -1 : lastPlaceIdx[division] + placeResponse.data.length;

        setLastPlaceIdx((prevIdx) => ({
          ...prevIdx,
          [division]: newLastPlaceIdx,
        }));
        onResultsUpdate(newPlaceResults); // Update the parent component with new results


        setDivisions((preDivisions: DivisionsType) => ({
          ...preDivisions,
          [division]: [...preDivisions[division], ...placeResponse.data],
        }));

      } catch (error) {
        console.error('Failed to fetch place search results:', error);
      }
    };
    const placeOptions = {
      root: scrollContainerRef.current,
      rootMargin: '20px',
      threshold: 0.8,
    };

    const placeCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchPlaceDataOnScroll(activeDivision);
        }
      });
    };

    placeObserver.current = new IntersectionObserver(
      placeCallback,
      placeOptions,
    );

    if (placeLoadMoreRef.current) {
      placeObserver.current.observe(placeLoadMoreRef.current);
    }

    return () => {
      if (placeObserver.current) {
        if (placeLoadMoreRef.current) {
          placeObserver.current.unobserve(placeLoadMoreRef.current);
        }
        placeObserver.current.disconnect();
      }
    };
  }, [location.search, lastPlaceIdx, activeDivision, divisions, onResultsUpdate, city, searchTerm]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tab === '일정 보기') {
          const planResponse = await axios.get(
            `/tour/schedules?city=${city}&keyword=${searchTerm}`,
          );
          setPlanSearchResults(planResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch plan search results:', error);
      }
    };

    fetchData();
  }, [location.search, tab, city, searchTerm]);


  useEffect(() => {
    setPlanSearchResults([]);
    setDivisions({
      '전체': [],
      '음식점': [],
      '문화시설': [],
      '축제 공연 행사': [],
      '관광지': [],
      '레포츠': [],
      '숙박': [],
      '쇼핑': [],
    });
    setLastPlaceIdx({
      '전체': 0,
      '음식점': 0,
      '문화시설': 0,
      '축제 공연 행사': 0,
      '관광지': 0,
      '레포츠': 0,
      '숙박': 0,
      '쇼핑': 0,
    });
    if (activeDivision === '전체') {
      setActiveDivision('음식점');
    } else {
      setActiveDivision('전체');
    }

    return () => {
      { tab === '장소 보기' && activeDivision === '전체' && <div ref={placeLoadMoreRef}></div> }
      { tab === '장소 보기' && activeDivision === '음식점' && <div ref={placeLoadMoreRef}></div> }
      { tab === '장소 보기' && activeDivision === '문화시설' && <div ref={placeLoadMoreRef}></div> }
      { tab === '장소 보기' && activeDivision === '축제 공연 행사' && <div ref={placeLoadMoreRef}></div> }
      { tab === '장소 보기' && activeDivision === '관광지' && <div ref={placeLoadMoreRef}></div> }
      { tab === '장소 보기' && activeDivision === '레포츠' && <div ref={placeLoadMoreRef}></div> }
      { tab === '장소 보기' && activeDivision === '숙박' && <div ref={placeLoadMoreRef}></div> }
      { tab === '장소 보기' && activeDivision === '쇼핑' && <div ref={placeLoadMoreRef}></div> }

    }
  }, [location.search]);

  return (
    <div className="bg-white px-5 w-full h-full  overflow-y-auto">
      {(tab === '장소 보기' && Object.keys(divisions).includes(activeDivision)) &&
        divisions[activeDivision].map((place: PlaceData, index) => (
          <Link
            key={index}
            to={{ pathname: '/placeinfo' }}
            state={{ place }}
            className="w-full h-[30%] p-5 flex rounded-md shadow-xl mb-2"
          >
            <div ref={index === divisions[activeDivision].length - 1 && lastPlaceIdx[activeDivision] !== -1 ? placeLoadMoreRef : null}>
              <div className="flex">
                {place.imageUrl ? (
                  <img src={place.imageUrl} alt={place.name} className="w-32 h-32 mt-2" />
                ) : (
                    <img src={process.env.PUBLIC_URL + '/image/logo.png'} className='h-32 w-32'></img>
                )}
                <div className="flex flex-col p-2">
                <h3 className="font-[BMJUA] text-xl">{place.name}</h3>
                  <p className="font-[Nanum Gothic] text-gray-600">
                    {place.address}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      {tab === '일정 보기' &&
        planSearchResults.map((plan: PlanData, index) => (
          <Link
            key={index}
            to={{
              pathname: '/scheduleex',
              search: `?scheduleId=${plan.scheduleId}`,
            }}
            state={{ plan }}
            className="w-full h-[30%] p-5 flex rounded-md shadow-xl mb-2"
          >
            <div className="flex">
              {plan.imageUrl && (
                <img
                  src={plan.imageUrl}
                  alt={plan.name}
                  className="w-32 h-32 mt-2"
                />
              )}
              <div className="flex flex-col p-2">
                <h3 className="font-[BMJUA] text-xl">{plan.name}</h3>
                <p className="font-[Nanum Gothic] text-gray-600">
                  {plan.startDate} - {plan.endDate}
                </p>
              </div>
            </div>
          </Link>
        ))}
      {tab === '장소 보기' && activeDivision === '전체' && <div ref={placeLoadMoreRef}></div>}
      {tab === '장소 보기' && activeDivision === '음식점' && <div ref={placeLoadMoreRef}></div>}
      {tab === '장소 보기' && activeDivision === '문화시설' && <div ref={placeLoadMoreRef}></div>}
      {tab === '장소 보기' && activeDivision === '축제 공연 행사' && <div ref={placeLoadMoreRef}></div>}
      {tab === '장소 보기' && activeDivision === '관광지' && <div ref={placeLoadMoreRef}></div>}
      {tab === '장소 보기' && activeDivision === '레포츠' && <div ref={placeLoadMoreRef}></div>}
      {tab === '장소 보기' && activeDivision === '숙박' && <div ref={placeLoadMoreRef}></div>}
      {tab === '장소 보기' && activeDivision === '쇼핑' && <div ref={placeLoadMoreRef}></div>}
      {tab === '일정 보기' && <div ref={planLoadMoreRef}></div>}
    </div>
  );
};

export default SearchResults;
