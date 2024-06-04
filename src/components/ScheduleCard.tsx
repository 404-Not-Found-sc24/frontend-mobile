import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ScheduleData {
  scheduleId: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  share: number;
  imageUrl: string;
}

interface ScheduleCardProps {
  data: ScheduleData;
  onDeleteSchedule: (scheduleId: number) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  data,
  onDeleteSchedule,
}) => {
  const {
    scheduleId,
    name,
    location,
    startDate,
    endDate,
    share: initialShare,
    imageUrl,
  } = data;
  const [differenceInDays, setDifferenceInDays] = useState<number>();
  const { accessToken, refreshAccessToken } = useAuth();
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [share, setShare] = useState<number>(initialShare);

  useEffect(() => {
    checkDate();
  }, []);

  const checkDate = async () => {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const currentDate = new Date();
    sDate.setHours(0, 0, 0, 0);
    eDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (currentDate > eDate) {
      const differenceInMilliseconds = currentDate.getTime() - eDate.getTime();
      setDifferenceInDays(
        Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24)),
      );
    } else if (currentDate <= eDate && currentDate >= sDate) {
      setDifferenceInDays(0);
    } else if (currentDate < sDate) {
      const differenceInMilliseconds = currentDate.getTime() - sDate.getTime();
      setDifferenceInDays(
        Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24)),
      );
    }
  };

  const handleScheduleClick = (data: ScheduleData) => {
    // 페이지 이동 처리
    navigate('/myplanpage', { state: { data } });
  };

  const handleDeleteSchedule = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    // 일정 삭제 처리
    setShowDeletePopup(true);
    // 알림 또는 다른 작업 수행
  };

  const deleteSchedule = async (scheduleId: number) => {
    try {
      // 복사된 일정 데이터를 서버에 전송하여 저장합니다.
      const response = await axios.delete(`/schedule/${scheduleId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // 저장이 완료되면 사용자에게 알립니다. (예: 모달, 알림 등)
      console.log('일정이 성공적으로 삭제되었습니다:', response.data);
      onDeleteSchedule(scheduleId);
      setShowDeletePopup(false);
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
        console.error('일정 삭제 중 오류 발생:', error);
      }
    }
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
    await deleteSchedule(scheduleId); // 일정 삭제
  };

  const handleShare = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    try {
      console.log(scheduleId);
      const newShareValue = share === 1 ? 0 : 1;
      await axios.patch(
        `/schedule/sharing/` + scheduleId,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(newShareValue);
      setShare(newShareValue);
      toast.success('공유 설정이 변경되었습니다.');
    } catch (error) {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
          await handleShare(e); // 액세스 토큰을 갱신 후 다시 시도
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('공유 설정 변경 중 오류 발생:', error);
        toast.error('공유 설정 변경에 실패했습니다.');
      }
    }
  };

  return (
    <div
      className="w-full flex p-2 h-30 shadow-md"
      onClick={() => handleScheduleClick(data)}
    >
      <div className="flex w-full">
        <div className="w-45 h-full mr-2">
          {imageUrl !== null ? (
            <img src={imageUrl} alt="" className="h-full w-full"></img>
          ) : (
            <img src={process.env.PUBLIC_URL + '/image/logo.png'} className='h-full max-w-full'></img>
          )}
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between mb-1">
            <div className="text-main-red-color text-md font-bold w-20 mr-5font-['BMJUA']">
              {differenceInDays !== undefined &&
                (differenceInDays === 0
                  ? 'D-Day'
                  : `D${differenceInDays > 0 ? '+' : '-'}${Math.abs(
                    differenceInDays,
                  )}`)}
            </div>
            <div className="text-md w-15">
              <button onClick={handleShare} className="hover:font-bold font-['BMJUA']">
                {share == 1 ? 'PUBLIC' : 'PRIVATE'}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-start">
            <div className="text-sm flex-grow font-['BMJUA']">{location}</div>
          </div>
          <div className="flex flex-grow items-center justify-start my-2">
            <div className="text-lg font-bold font-['BMJUA'] overflow-hidden whitespace-nowrap overflow-ellipsis">
              {name.length > 8 ? `${name.substring(0, 8)}...` : name}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm font-['BMJUA']">
              {startDate} <br />~ {endDate}
            </div>
            <div className="flex items-center">
              <img
                src={`${process.env.PUBLIC_URL}/image/recycle-bin.png`}
                alt="휴지통"
                className="w-5 h-5 text-main-red-color cursor-pointer"
                onClick={(e) => handleDeleteSchedule(e)}
              ></img>
            </div>
          </div>
        </div>
      </div>
      {showDeletePopup && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-3 rounded w-3/4 h-1/4 flex flex-col items-center">
              <div className="h-24 flex items-center font-[BMJUA] text-xl">
                일정을 삭제하시겠습니까?
              </div>
              <div>
                <button
                    onClick={handlePopupClose}
                    className="w-16 text-white bg-main-red-color py-0.5 px-3 mr-3 font-[BMJUA]"
                >
                  취소
                </button>
                <button
                    onClick={handleConfirmClick}
                    className="w-16 text-white bg-main-red-color py-0.5 px-3 font-[BMJUA]"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default ScheduleCard;
