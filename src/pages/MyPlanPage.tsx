import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapProvider } from '../context/MapContext';
import Map from '../components/Map';
import axios, { AxiosError } from 'axios';
import MyPlanDetailBox from '../components/MyPlanDetailBox';

interface PlanData {
  placeId: number;
  locationId: number;
  locationName: string;
  date: string;
  time: string;
  diaryId: number;
  title: string;
  content: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

const MyPlanPage: React.FC = () => {
  const location = useLocation();
  const plan = location.state.data;
  const scheduleId = location.state.data.scheduleId;
  const accessToken = localStorage.getItem('accessToken');
  const [activeTab, setActiveTab] = useState<number>(1);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const { refreshAccessToken } = useAuth();
  const [planData, setPlanData] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  const navigate = useNavigate();

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
    setDropdownVisible(false); // 드롭다운 닫기
  };

  const generateTabs = () => {
    const tabs = [];
    for (let i = 1; i <= 3 && i <= diffDays; i++) {
      tabs.push(
        <button
          key={i}
          className={`w-16 h-full bg-[#FF9A9A] rounded-2xl text-white font-['BMJUA'] text-sm mr-2 ${activeTab === i ? 'opacity-100' : 'opacity-50'
            }`}
          onClick={() => handleTabClick(i)}
        >
          {`${i}일차`}
        </button>,
      );
    }
    if (diffDays > 3) {
      tabs.push(
        <div key="more" className="relative w-16 h-full">
          <button
            className={`w-16 h-full bg-[#FF9A9A] rounded-2xl text-white font-['BMJUA'] text-sm mr-2 ${activeTab > 3 ? 'opacity-100' : 'opacity-50'
              }`}
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            {activeTab > 3 ? `${activeTab}일차` : '...'}
          </button>
          {dropdownVisible && (
            <div className="fixed bg-white w-24 z-10 mt-2 rounded-2xl max-h-48 overflow-y-auto">
              {Array.from({ length: diffDays - 3 }, (_, i) => i + 4).map(
                (day) => (
                  <button
                    key={day}
                    className={`block w-full my-1 px-4 py-2 bg-[#FF9A9A] rounded-2xl text-white font-['BMJUA'] text-sm ${activeTab === day ? 'opacity-100' : 'opacity-50'
                      } hover:opacity-100`}
                    onClick={() => {
                      handleTabClick(day);
                      setDropdownVisible(false);
                    }}
                  >
                    {`${day}일차`}
                  </button>
                ),
              )}
            </div>
          )}
        </div>,
      );
    }
    return tabs;
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await axios.get(`/schedule/schedules/${scheduleId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPlanData(response.data);
        setLoading(false); // 데이터 로드 완료
      } catch (e) {
        if (
          (e as AxiosError).response &&
          (e as AxiosError).response?.status === 401
        ) {
          try {
            await refreshAccessToken();
            // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
            // 여기에서는 재시도 로직을 추가할 수 있습니다.
          } catch (refreshError) {
            console.error('Failed to refresh access token:', refreshError);
          }
        } else {
          console.error('일정 데이터를 불러오는 중 오류가 발생했습니다.', e);
        }
      }
    };

    fetchScheduleData();
  }, [scheduleId]);

  const getPlacesByDay = (day: number) => {
    return planData.filter(
      (data) =>
        Math.ceil(
          Math.abs(new Date(data.date).getTime() - startDate.getTime()) /
          (1000 * 3600 * 24) +
          1,
        ) === day,
    );
  };

  const activePlaces = useMemo(
    () => getPlacesByDay(activeTab),
    [activeTab, planData],
  );

  console.log(activePlaces);
  const initialMarkers = activePlaces.map((place) => ({
    placeId: place.locationId,
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  const initialCenter =
    activePlaces.length > 0
      ? {
        latitude: activePlaces[0].latitude,
        longitude: activePlaces[0].longitude,
      }
      : { latitude: 37.2795, longitude: 127.0438 };


  const naviBack = () => {
    window.history.back();
  };

  if (loading) {
    return <div>Loading...</div>; // 데이터 로드 중일 때 로딩 표시
  }

  return (
    <div className="flex w-full h-[90%] flex flex-col">
      <div className="flex w-full">
        <i
          className="backArrow ml-2 cursor-pointer w-[10%]"
          onClick={naviBack}
        ></i>
        <div className=" ml-3 flex flex-col w-11/12">
          <div className="font-['BMJUA'] text-2xl text-black flex items-center">
            {plan.name}
          </div>
          <div className="font-['BMJUA'] text-sm text-[#ED661A] flex items-center">
            {plan.startDate} ~ {plan.endDate}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center  flex-grow overflow-hidden">
        <div className="w-11/12 h-full pt-3 pb-5 flex flex-col overflow-hidden">
          <div className="flex justify-between h-7 mb-2">
            <div className="flex items-center">{generateTabs()}</div>
          </div>
          {Array.from({ length: diffDays }, (_, index) => (
            <div key={index} className="flex overflow-hidden">
              {activeTab === index + 1 && (
                <div className="flex-col flex-1 overflow-y-auto h-full">
                  {planData
                    .filter(
                      (data) =>
                        Math.ceil(
                          Math.abs(
                            new Date(data.date).getTime() -
                            startDate.getTime(),
                          ) /
                          (1000 * 3600 * 24) +
                          1,
                        ) ===
                        index + 1,
                    )
                    .map((filteredData, dataIndex) => (
                      <MyPlanDetailBox
                        key={dataIndex}
                        scheduleData={filteredData}
                        planName={plan.name}
                      />
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPlanPage;
