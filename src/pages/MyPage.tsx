import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ScheduleCard from '../components/ScheduleCard';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosError } from 'axios';

interface ScheduleData {
  scheduleId: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  share: number;
  imageUrl: string;
}

interface UserInfo {
  memberId: number;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  role: string;
  imageUrl: string;
}

interface ScheduleList {
  beforeTravel: ScheduleData[];
  traveling: ScheduleData[];
  afterTravel: ScheduleData[];
}

const MyPage: React.FC = () => {
  const [beforeTravel, setBeforeTravel] = useState<ScheduleData[]>([]);
  const [traveling, setTraveling] = useState<ScheduleData[]>([]);
  const [afterTravel, setAfterTravel] = useState<ScheduleData[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('여행 전');
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

  const { refreshAccessToken } = useAuth();
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const getSchedules = async () => {
    try {
      const response = await axios.get('/schedule', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBeforeTravel(response.data.beforeTravel);
      setTraveling(response.data.traveling);
      setAfterTravel(response.data.afterTravel);
    } catch (error) {
      if ((error as AxiosError).response) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          // 액세스 토큰 갱신에 실패한 경우 사용자에게 알립니다.
        }
      } else {
        console.error('일정 조회 중 오류 발생:', error);
      }
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get('/auth', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserInfo(response.data);
    } catch (error) {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          // 액세스 토큰 갱신에 실패한 경우 사용자에게 알립니다.
        }
      } else {
        console.error('일정 조회 중 오류 발생:', error);
      }
    }
  };

  const navigateToTravel = (curr: string) => {
    navigate('/traveldes', {
      state: {
        curr: curr,
      },
    });
  };

  const navigateToSetting = (data: UserInfo) => {
    navigate('/mypage-setting', { state: { data } });
  };

  const onDeleteSchedule = (scheduleId: number) => {
    setShowSuccessPopup(true);
    // 일정 삭제 후 상태 업데이트
    if (activeTab === '여행 전') {
      const updatedSchedules = beforeTravel.filter(
        (schedule) => schedule.scheduleId !== scheduleId,
      );
      setBeforeTravel(updatedSchedules);
    } else if (activeTab === '여행 중') {
      const updatedSchedules = traveling.filter(
        (schedule) => schedule.scheduleId !== scheduleId,
      );
      setTraveling(updatedSchedules);
    } else if (activeTab === '여행 후') {
      const updatedSchedules = afterTravel.filter(
        (schedule) => schedule.scheduleId !== scheduleId,
      );
      setAfterTravel(updatedSchedules);
    }
  };

  useEffect(() => {
    getSchedules();
    getUserInfo();
  }, [refreshAccessToken]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const renderScheduleCards = (
    scheduleData: ScheduleData[],
    onDeleteSchedule: (scheduleId: number) => void,
  ) => {
    return (
      <div>
        {scheduleData.map((data: ScheduleData, index: number) => {
          return (
            <div
              className="w-full h-full flex flex-col items-center pt-3"
              key={index}
            >
              <ScheduleCard data={data} onDeleteSchedule={onDeleteSchedule} />
            </div>
          );
        })}
      </div>
    );
  };

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="h-full">
      <div className="h-[22rem]">
        <div className="w-full h-44 bg-main-red-color"></div>
        <div className="relative flex justify-center">
          {userInfo?.imageUrl == null ? (
            <img
              src={`${process.env.PUBLIC_URL}/image/user.png`}
              alt="유저 기본 이미지"
              className="absolute w-24 h-24 -top-10 bg-white rounded-full"
            />
          ) : (
            <img
              src={userInfo.imageUrl}
              alt="유저 프로필 이미지"
              className="absolute w-24 h-24 -top-10 bg-white rounded-full"
            />
          )}
          <h1 className="absolute top-16 text-3xl font-medium">
            {userInfo?.nickname}
          </h1>
          <button
            onClick={() => {
              if (userInfo) {
                navigateToSetting(userInfo);
              } else {
                console.log('User info is not available');
              }
            }}
            className="text-ms text-main-green-color font-Nanum Gothic underline underline-offset-4 absolute top-28"
          >
            사용자 설정
          </button>
        </div>
      </div>
      <div className="flex justify-center ">
        <div className="w-3/4 mb-5">
          <div className="flex flex-row justify-between mb-5">
            <div className="flex flex-row">
              <div className="bg-main-red-color w-[0.3rem] h-8 rounded"></div>
              <h1 className="text-3xl font-medium mx-3">나의 일정</h1>
              <h1 className="text-3xl font-medium text-main-red-color">
                {beforeTravel.length + traveling.length + afterTravel.length}
              </h1>
            </div>
            <button
              className="bg-main-red-color text-white rounded-full px-3 py-1"
              onClick={() => navigateToTravel('schedule')}
            >
              + 일정 추가
            </button>
          </div>
          <div className="w-full flex justify-center">
            <div className="flex pt-4 w-full">
              <div
                id="1"
                className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                  activeTab === '여행 전'
                    ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                    : 'border-b-2'
                }`}
                onClick={() => handleTabClick('여행 전')}
              >
                여행 전
              </div>
              <div
                id="2"
                className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                  activeTab === '여행 중'
                    ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                    : 'border-b-2'
                }`}
                onClick={() => handleTabClick('여행 중')}
              >
                여행 중
              </div>
              <div
                id="3"
                className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                  activeTab === '여행 후'
                    ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                    : 'border-b-2'
                }`}
                onClick={() => handleTabClick('여행 후')}
              >
                여행 후
              </div>
            </div>
          </div>
          <div>
            {activeTab === '여행 전' &&
              (beforeTravel.length > 0 ? (
                renderScheduleCards(beforeTravel, onDeleteSchedule)
              ) : (
                <div className="flex justify-center items-center h-44 shadow-md">
                  <div className="text-slate-300 font-bold text-3xl">
                    계획 중인 여행이 없습니다.
                  </div>
                </div>
              ))}
            {activeTab === '여행 중' &&
              (traveling.length > 0 ? (
                renderScheduleCards(traveling, onDeleteSchedule)
              ) : (
                <div className="flex justify-center items-center h-44 shadow-md">
                  <div className="text-slate-300 font-bold text-3xl">
                    여행 중인 일정이 없습니다.
                  </div>
                </div>
              ))}
            {activeTab === '여행 후' &&
              (afterTravel.length > 0 ? (
                renderScheduleCards(afterTravel, onDeleteSchedule)
              ) : (
                <div className="flex justify-center items-center h-44 shadow-md">
                  <div className="text-slate-300 font-bold text-3xl">
                    종료된 여행이 없습니다.
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="popup fixed top-0 l-0 w-full h-100% bg-black/50 flex justify-center">
          <div className="bg-white p-3 rounded mt-10 w-1/3 h-36 flex items-center flex-col">
            <div className="h-24 flex items-center">일정이 삭제되었습니다.</div>
            <button
              onClick={handlePopupClose}
              className="w-16 text-white bg-main-red-color py-0.5 px-3"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
