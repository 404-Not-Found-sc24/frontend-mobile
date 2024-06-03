import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';
import PlaceBox from '../components/PlaceBox';
import DayPlace from '../components/DayPlace';
import axios, { AxiosError } from 'axios';
import Place from '../../types/Place';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { MapProvider } from '../context/MapContext';
import Map from '../components/Map';

interface State {
  center: {
    lat: number;
    lng: number;
  };
  errMsg: string | null;
  isLoading: boolean;
}

const MakePlan = () => {
  const location = useLocation();
  const tripInfo = { ...location.state };
  tripInfo.startDate = new Date(tripInfo.startDate);
  tripInfo.endDate = new Date(tripInfo.endDate);
  const tripdataRef = useRef(tripInfo);
  const navigate = useNavigate();
  const [tripDays, setTripDays] = useState<number>(0);
  const [keyword, setKeyword] = useState('');
  const [lastIdx, setLastIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [res, setRes] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[][]>([[], [], []]);
  const { accessToken, refreshAccessToken } = useAuth();
  const placeLoadMoreRef = useRef<HTMLDivElement>(null);
  const placeObserver = useRef<IntersectionObserver>();
  const curr = 'makeplan';
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';
  const city = queryParams.get('city') || '';
  const isLoading = useRef<boolean>(false);
  const [times, setTimes] = useState<string[][]>([[], [], []]);
  const [state, setState] = useState<State>({
    center: {
      lat: 37.2795,
      lng: 127.0438,
    },
    errMsg: null,
    isLoading: true,
  });

  const [initialCenter, setInitialCenter] = useState({
    latitude: state.center.lat,
    longitude: state.center.lng,
  });
  const [key, setKey] = useState(JSON.stringify(initialCenter));

  const activePlaces = selectedPlaces[activeTab - 1] || [];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
          setInitialCenter({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        },
      );
    } else {
      setState((prev) => ({
        ...prev,
        errMsg: 'geolocation을 사용할 수 없어요..',
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    if (activePlaces.length > 0) {
      console.log(activePlaces[activePlaces.length - 1].latitude);
      setInitialCenter({
        latitude: activePlaces[activePlaces.length - 1].latitude,
        longitude: activePlaces[activePlaces.length - 1].longitude,
      });
    }
  }, [selectedPlaces, activePlaces, res, state.center.lat, state.center.lng]);

  useEffect(() => {
    setKey(JSON.stringify(initialCenter));
  }, [initialCenter]);

  const handleTimeChange = (
    dayIndex: number,
    placeIndex: number,
    time: string,
  ) => {
    setTimes((prevTimes) => {
      const updatedTimes = [...prevTimes];
      if (!updatedTimes[dayIndex - 1]) {
        updatedTimes[dayIndex - 1] = [];
      }
      updatedTimes[dayIndex - 1][placeIndex] = time;
      return updatedTimes;
    });
  };

  useEffect(() => {
    console.log(times);
  }, [times]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const fetchPlaceDataOnScroll = async () => {
    if (!isLoading.current) {
      isLoading.current = true;
      try {
        const placeResponse = await axios.get(
          `/tour/locations?city=${city}&keyword=${searchTerm}&lastIdx=${lastIdx}`,
        );

        setRes((prevData) => [...prevData, ...placeResponse.data]);
        setLastIdx((prevLastIdx) => prevLastIdx + placeResponse.data.length);
      } catch (error) {
        console.error('Failed to fetch place search results:', error);
      } finally {
        isLoading.current = false;
      }
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `tour/locations?city=${tripdataRef.current.city}&keyword=${keyword}&lastIdx=${lastIdx}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setRes((prevData) => [...prevData, ...response.data]);
      setLastIdx((prevLastIdx) => prevLastIdx + response.data.length);
    } catch (error) {
      console.error('Failed to fetch place search results:', error);
    }
  };

  const addSelectedPlace = (selectedPlace: Place, dayIndex: number) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      const newSelectedPlaces = [...prevSelectedPlaces];
      if (!newSelectedPlaces[dayIndex - 1]) {
        newSelectedPlaces[dayIndex - 1] = [];
      }
      const modifiedPlace = { ...selectedPlace, placeId: null };
      newSelectedPlaces[dayIndex - 1].push(modifiedPlace);
      return newSelectedPlaces;
    });
  };

  const removePlace = (dayIndex: number, placeIndex: number) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      const newSelectedPlaces = [...prevSelectedPlaces];
      if (newSelectedPlaces[dayIndex - 1]) {
        newSelectedPlaces[dayIndex - 1].splice(placeIndex, 1);
      }
      return newSelectedPlaces;
    });
  };

  const generateSelectOptions = (days: number) => {
    const options = [];
    for (let i = 1; i <= days; i++) {
      options.push(
        <option key={i} value={i}>
          {`${i}일차`}
        </option>,
      );
    }
    return options;
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const naviBack = () => {
    navigate('/');
  };

  const notifySuccess = () =>
    toast.success('장소가 성공적으로 추가되었습니다!', {
      position: 'top-center',
    });
  const addPlace = async () => {
    try {
      const postData = selectedPlaces.flatMap((innerArray, index) => {
        console.log(index, innerArray);
        const startDate = new Date(tripdataRef.current.startDate);
        const currentDate = new Date(startDate);
        if (tripInfo.check === 0) {
          currentDate.setDate(startDate.getDate() + index + 1);
        } else {
          currentDate.setDate(startDate.getDate() + index);
        }
        return innerArray
          .map((place, innerIndex) => {
            console.log(times[index]);
            return {
              placeId: place.placeId != null ? place.placeId : null,
              locationId: place.locationId,
              date: currentDate.toISOString().slice(0, 10),
              time: times[index][innerIndex],
            };
          })
          .filter((placeData) => placeData !== null);
      });

      await axios
        .post('/schedule/place/' + tripdataRef.current.scheduleId, postData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          notifySuccess();
          const id = setTimeout(() => {
            navigate('/');
          }, 3000);
          setTimeoutId(id);
        });
    } catch (error) {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('Failed to add place:', error);
      }
    }
  };

  const checkPlaces = async () => {
    try {
      await axios
        .get('/schedule/places/' + tripInfo.scheduleId, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setSelectedPlaces(response.data);
        });
    } catch (error) {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('Failed to add place:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (tripdataRef.current.startDate && tripdataRef.current.endDate) {
        const differenceInTime =
          tripdataRef.current.endDate.getTime() -
          tripdataRef.current.startDate.getTime();
        const differenceInDays = Math.floor(
          differenceInTime / (1000 * 3600 * 24),
        );
        const tripDays = differenceInDays + 1;
        setTripDays(tripDays);

        await checkPlaces();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPlaces.length === 0) {
      const newTripPlaces = Array.from(
        { length: tripDays },
        () => [] as Place[],
      );
      setSelectedPlaces(newTripPlaces);
    }
  }, [tripDays]);

  useEffect(() => {
    const placeOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    const placeCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (searchTerm) {
            fetchPlaceDataOnScroll();
          } else {
            getData();
          }
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
        placeObserver.current.disconnect();
      }
    };
  }, [placeLoadMoreRef, location.search, lastIdx]);

  useEffect(() => {
    setLastIdx(0);
    setRes([]);
  }, [location.search]);

  useEffect(() => {
    console.log(initialMarkers);
    setKey(JSON.stringify(initialMarkers));
  }, [selectedPlaces]);

  const initialMarkers = activePlaces.map((place) => ({
    placeId: place.locationId,
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  return (
    <div className="w-full h-[90%] flex">
      <ToastContainer />
      <div className="w-1/2 h-full flex">
        <div className="w-1/2 h-full flex flex-col">
          <div className="flex w-full h-[10%]">
            <i
              className="backArrow ml-2 cursor-pointer w-[10%]"
              onClick={naviBack}
            ></i>
            <div className="flex items-center w-[90%]">
              <div className="font-['BMJUA'] text-3xl text-black ml-2 flex items-center">
                {tripInfo.city}
              </div>
            </div>
          </div>
          <div className="h-[10%]">
            <SearchBar curr={curr} />
          </div>
          <div className="flex justify-center h-[80%] overscroll-y-auto">
            <div className="w-11/12 grid grid-cols-2 justify-items-center items-center gap-3 mt-4 overflow-y-auto">
              {res.map((place: Place, index: number) => (
                <PlaceBox
                  key={index}
                  place={place}
                  addSelectedPlace={() => addSelectedPlace(place, activeTab)}
                />
              ))}
              <div ref={placeLoadMoreRef}></div>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full flex">
          <div className="flex flex-col w-full h-full border-4 border-[#FF9A9A] justify-between">
            <div className="select-container">
              <select
                className="day-select"
                value={activeTab}
                onChange={(e) => handleTabClick(Number(e.target.value))}
              >
                {generateSelectOptions(tripDays)}
              </select>
            </div>
            <div className="tab-content h-[80%] overflow-y-scroll">
              {Array.from({ length: tripDays }, (_, tabIndex) => (
                <div
                  key={tabIndex + 1}
                  id={`content${tabIndex + 1}`}
                  className={`content ${
                    activeTab === tabIndex + 1 ? 'active' : ''
                  }`}
                >
                  <div className="contentBox">
                    {selectedPlaces[activeTab - 1] && (
                      <div className="w-full h-full flex flex-col items-center pt-3">
                        {selectedPlaces[activeTab - 1].map(
                          (selectedPlace, index) => (
                            <DayPlace
                              key={index}
                              dayIndex={activeTab}
                              placeIndex={index}
                              selectedPlace={selectedPlace}
                              removePlace={(dayIndex, placeIndex) =>
                                removePlace(dayIndex, placeIndex)
                              }
                              onTimeChange={handleTimeChange}
                            />
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-[100px] w-full flex justify-center items-center">
              <button
                className="h-1/2 bg-black text-white px-10 rounded-md text-xl font-['BMJUA']"
                onClick={addPlace}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      </div>
      <MapProvider
        key={key}
        initialCenter={initialCenter}
        initialMarkers={initialMarkers}
      >
        <Map />
      </MapProvider>
    </div>
  );
};

export default MakePlan;
