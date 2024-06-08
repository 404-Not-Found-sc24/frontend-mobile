import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import { MapProvider } from '../context/MapContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import SmallMap from '../components/SmallMap';

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

interface Diary {
  userName: string;
  title: string;
  date: string;
  weather: string;
  content: string;
  imageUrl: string;
}

const MyDiaryDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const PlanData = location.state.PlanData;
  const planName = location.state.planName;
  const [Diarydata, setDiaryData] = useState<Diary | null>(null);
  const accessToken = localStorage.getItem('accessToken');
  const { refreshAccessToken } = useAuth();
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [isBeforeStartDate, setIsBeforeStartDate] = useState<boolean>(false);
  useEffect(() => {
    const getData = async () => {
      console.log(PlanData);
      try {
        await axios
          .get(`/tour/diary/${PlanData.diaryId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            console.log(response.data);
            setDiaryData(response.data);
          });
      } catch (e) {
        console.error('Error:', e);
      }
    };
    getData();

    const today = new Date();
    const startDate = new Date(PlanData.date);
    setIsBeforeStartDate(today < startDate);
  }, []);

  const handleDeleteDiary = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setShowDeletePopup(true);
  };

  const deleteDiary = async () => {
    try {
      const response = await axios.delete(
        `/schedule/diary/${PlanData.diaryId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      console.log('일정이 성공적으로 삭제되었습니다:', response.data);
      setShowDeletePopup(false);
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
        console.error('일정 삭제 중 오류 발생:', error);
      }
    }
  };

  const initialMarkers = PlanData
    ? [
      {
        placeId: PlanData.placeId,
        latitude: PlanData.latitude,
        longitude: PlanData.longitude,
      },
    ]
    : [];

  const initialCenter = PlanData
    ? { latitude: PlanData.latitude, longitude: PlanData.longitude }
    : { latitude: 37.2795, longitude: 127.0438 };

  const naviBack = () => {
    window.history.back();
  };

  const navimakediary = () => {
    navigate('/makediary', { state: { PlanData: PlanData } });
  };

  const navieditdiary = () => {
    navigate('/editdiary', {
      state: { PlanData: PlanData, Diarydata: Diarydata },
    });
  };

  const handlePopupClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setShowDeletePopup(false);
  };

  const handleConfirmClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    await deleteDiary(); // 일정 삭제
    setShowSuccessPopup(true);
  };
  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate('/mypage');
  };

  const handleLinkKakao = () => {
    // 버튼을 눌렀을 때 이동할 링크 주소
    const linkUrl = 'https://map.kakao.com/link/to/'+PlanData.locationName+","+PlanData.latitude+","+PlanData.longitude;
    console.log(linkUrl);

    // 새 창으로 링크를 열기
    window.open(linkUrl, '_blank');
  };

  return (
    <div className="flex w-full h-[85%] flex-col">
      <div className="flex justify-between items-center w-[95%] flex-row">
        <div className="flex w-full">
          <i
            className="backArrow ml-2 cursor-pointer w-[10%]"
            onClick={naviBack}
          ></i>
          <div className="flex flex-col ml-3">
            <div className="font-['BMJUA'] text-xl text-black flex items-center">
              {planName}
            </div>
            <div className="font-['BMJUA'] text-md text-[#ED661A] flex items-center">
              {PlanData.date}
            </div>
          </div>
        </div>
        {!isBeforeStartDate && (
          <div className='w-[25%] mr-5'>
            {Diarydata ? (
              <button
                onClick={navieditdiary}
                className="flex items-center justify-center w-full h-7 bg-black rounded-2xl text-white font-['Nanum Gothic'] text-xs font-semibold px-2"
              >
                일기 수정
              </button>
            ) : (
              <button
                onClick={navimakediary}
                className="flex items-center justify-center w-full h-7 bg-black rounded-2xl text-white font-['Nanum Gothic'] text-xs font-semibold px-2"
              >
                일기 작성
              </button>
            )}
          </div>
        )}
      </div>
      <div className="w-full h-[95%] flex justify-center">
        <div className="w-5/6">
          <div className="w-full h-full flex flex-col pt-3">
            <div className="w-full h-full flex flex-col py-5 rounded-md shadow-xl">
              <div className="flex h-[10%] mx-5 items-center">
                <div className="flex justify-between w-[100%] items-center">
                  <div className="font-['BMJUA'] text-lg">
                    {PlanData.locationName}
                  </div>
                  {Diarydata ? (
                    <button
                      onClick={deleteDiary}
                      className="flex items-center justify-end w-20 h-7 "
                    >
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          '/image/delete-bin-6-line.png'
                        }
                        alt="삭제"
                        width="25"
                        height="25"
                        onClick={(e) => handleDeleteDiary(e)}
                      />
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              {PlanData.title ? (
                <div className="flex flex-col h-[55%]">
                  <div className="flex justify-center m-3 h-28">
                    {PlanData.imageUrl ?
                      <img
                        src={PlanData.imageUrl}
                        className="h-28"
                        alt="지역소개사진"
                      />
                      :
                      (
                        <div className="w-[100%] flex items-center justify-center border">
                          <div className="text-center text-main-green-color font-bold font-BMJUA text-md">
                            등록된 사진이 없습니다.
                          </div>
                        </div>
                      )
                    }
                  </div>
                  <div className="mx-5 my-3 h-10">
                    <div className="flex justify-between">
                      <div className="w-[70%] font-['Nanum Gothic'] font-bold text-lg">
                        {PlanData.title}
                      </div>
                      {Diarydata && (
                        <div className="w-[20%] text-md flex justify-end">{Diarydata.weather}</div>
                      )}
                    </div>
                  </div>
                  <div className="mx-5 mb-3 flex flex-col h-[30%]">
                    <div className="font-['Nanum Gothic'] overflow-y-auto">
                      {PlanData.content.split('\n').map((line: string, index: number) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center font-['BMJUA'] text-xl text-main-green-color h-[50%] items-center">
                  {isBeforeStartDate ? '일정이 시작되지 않았습니다!' : '일기를 작성해주세요!'}
                </div>
              )}
              <div className="h-[35%] w-full flex justify-center flex-col">
                <div className="h-[88%] w-full flex justify-center">
                  <SmallMap latitude={PlanData.latitude} longitude={PlanData.longitude} />
                </div>
                <div className="w-full flex justify-center">
                  <button 
                  className=" h-8 w-[40%] font-white m-1 bg-[#FEE500]"
                  onClick={handleLinkKakao}>길찾기 바로가기</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeletePopup && (
        <div className="popup absolute top-0 left-0 z-50 w-full h-full bg-black/50 flex justify-center">
          <div className="bg-white p-3 rounded mt-10 w-2/3 h-36 flex items-center flex-col">
            <div className="h-24 flex items-center">
              일기를 삭제하시겠습니까?
            </div>
            <div className="flex flex-row">
              <button
                onClick={handlePopupClose}
                className="w-16 text-white bg-main-red-color py-0.5 px-3 mr-3"
              >
                취소
              </button>
              <button
                onClick={handleConfirmClick}
                className="w-16 text-white bg-main-red-color py-0.5 px-3"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessPopup && (
        <div className="popup absolute top-0 left-0 z-50 w-full h-full bg-black/50 flex justify-center">
          <div className="bg-white p-3 rounded mt-10 w-2/3 h-36 flex items-center flex-col">
            <div className="h-24 flex items-center">일기가 삭제되었습니다.</div>
            <button
              onClick={handleSuccessPopupClose}
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

export default MyDiaryDetail;
