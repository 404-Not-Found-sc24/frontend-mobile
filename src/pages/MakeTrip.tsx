import * as React from 'react';
import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import ModalBig from '../components/ModalBig';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import '../Calendar.css';
import MakePlan from './MakePlan';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

interface props {
  isOpen: boolean;
  city: string;
  cityDetail: string;
  imageUrl: string;
  handleCloseModal: () => void;
}

const MakeTrip = ({ isOpen, city, cityDetail, imageUrl, handleCloseModal }: props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const { accessToken, refreshAccessToken } = useAuth();
  const navigate = useNavigate();
  const [scheduleId, setScheduleId] = useState(0);
  const [share, setShare] = useState(0);

  useEffect(() => {
  }, [city, scheduleId]);

  useEffect(() => {
    // externalParameter에 변화가 있을 때만 modalOpen 상태를 변경
    if (isOpen !== modalOpen) {
      setStep(1);
      setModalOpen(isOpen);
    }
  }, [isOpen]);

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10); // 문자열을 숫자로 변환
    setShare(value); // 선택된 라디오 버튼의 값으로 share 상태 업데이트
  };

  const handleDateChange = useCallback(
    (value: any, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!startDate || (startDate && endDate)) {
        // 시작일이 없거나 시작일과 종료일이 모두 선택된 경우에는 새로운 시작일 설정
        if (Array.isArray(value)) {
          setStartDate(value[0]);
          setEndDate(value[1]);
        } else {
          setStartDate(value);
          setEndDate(null);
        }
      } else {
        // 시작일이 선택된 상태이고 종료일이 선택되지 않은 경우에는 종료일 설정
        if (Array.isArray(value)) {
          setEndDate(value[1]);
        } else {
          if (value >= startDate!) {
            setEndDate(value);
          } else {
            setEndDate(startDate!);
            setStartDate(value);
          }
        }
      }
    },
    [startDate, endDate],
  );

  const handleResetDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const getKoreanDateString = (date: Date | null) => {
    if (!date) return '';

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const months = [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ];

    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];

    return `${date.getFullYear()}년 ${month} ${date.getDate()}일 (${dayOfWeek})`;
  };

  const startDateString = getKoreanDateString(startDate);
  const endDateString = getKoreanDateString(endDate);

  const handlePrevStep = useCallback(() => {
    setStep((prevStep) => prevStep - 1);
  }, []);

  const handleNextStep = useCallback(() => {
    setStep((prevStep) => prevStep + 1);
  }, []);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      console.log(event.target.value);
      setTitle(event.target.value);
    },
    [],
  );

  const goHome = useCallback(() => {
    navigate('/');
  }, []);

  const naviPage = useCallback(() => {
    console.log(
      'city ',
      city,
      'title ',
      title,
      'endD ',
      endDate,
      'startD ',
      startDate,
      'scheduleId ',
      scheduleId,
    );
    navigate('/makeplan', {
      state: {
        startDate: startDate,
        endDate: endDate,
        city: city,
        name: title,
        scheduleId: scheduleId,
        check: 0
      },
    });
  }, [city, title, startDate, endDate, scheduleId]);

  function formatDate(date: Date) {
    if (!(date instanceof Date)) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const savePlan = async () => {
    try {
      const startPlanDate = startDate ? formatDate(startDate) : '';
      const endPlanDate = endDate ? formatDate(endDate) : '';

      console.log(title, city, startPlanDate, endPlanDate);
      const requestData = {
        name: title,
        location: city,
        startDate: startPlanDate,
        endDate: endPlanDate,
        share: share,
      };

      await axios
        .post('/schedule', requestData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log(response);
          const tempScheduleId = response.data;
          setScheduleId(tempScheduleId);
          setStep((prevStep) => prevStep + 1);
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
      }
    }
  };

  return (
    <>
      {modalOpen && (
        <ModalBig onClose={handleCloseModal}>
          <>
            {step === 1 && (
              <>
                <div className="font-['Nanum Gothic'] w-full h-full text-lg sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl font-semibold text-black mb-5">
                  {city}
                </div>
                <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row justify-between items-center w-full h-full">
                  <div className="mr-5 w-full h-full text-xs sm:text-md md:text-md lg:text-lg xl:text-lg">{cityDetail}</div>
                  <div className="w-full h-full flex justify-center">
                    <img src={imageUrl} className="max-h-80 object-cover" alt="지역소개사진"></img>
                  </div>
                </div>
                <div className="flex justify-center mt-10">
                  <button
                    className="bg-[#FF9A9A] rounded-md px-10 py-2 text-xl font-['BMJUA']"
                    onClick={handleNextStep}
                  >
                    다음
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <div className="flex justify-center items-center flex-col">
                <div className="font-['Nanum Gothic'] text-2xl mb-6">
                  여행 기간이 어떻게 되시나요?
                </div>
                <div className="calendar-container flex w-full mb-4 justify-center">
                  <Calendar
                    value={startDate}
                    onChange={handleDateChange}
                    selectRange={true}
                    view="month"
                    prev2Label={null}
                    next2Label={null}
                    calendarType="gregory"
                    formatDay={(locale, date) =>
                      date.toLocaleString('en', { day: 'numeric' })
                    }
                  />
                </div>
                {startDate && endDate ? (
                  <div>
                    <p className="text-center">
                      {startDateString}{' '}
                      <span className="font-['BMJUA'] bold text-lg">부터 </span>
                      {endDateString}{' '}
                      <span className="font-['BMJUA'] bold text-lg">
                        까지 여행
                      </span>
                    </p>
                  </div>
                ) : (
                  <></>
                )}
                <button
                  className="font-['Nanum Gothic'] flex justify-center text-[10px] mt-2 text-[#FF9A9A] underline"
                  onClick={handleResetDates}
                >
                  날짜 다시 설정하기
                </button>
                <div className="flex justify-center mt-2 w-64 justify-between">
                  <button
                    className="border-2 border-[#FF9A9A] bg-white rounded-md px-10 py-2 text-xl font-['BMJUA']"
                    onClick={handlePrevStep}
                  >
                    이전
                  </button>
                  <button
                    className="border-4 border-[#FF9A9A] bg-[#FF9A9A] rounded-md px-10 py-2 text-xl font-['BMJUA']"
                    onClick={handleNextStep}
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flex justify-center items-center flex-col">
                <div className="font-['Nanum Gothic'] text-2xl mb-6">
                  여행 일정의 이름을 지어주세요!
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={title}
                    placeholder="일정 이름"
                    className="w-72 p-2 mx-2 my-2 border-2 border-gray rounded-md font-['BMJUA']"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-48 flex justify-between font-['BMJUA']">
                  <label>
                    <input
                      type="radio"
                      value={0} // 개인일정
                      checked={share === 0}
                      onChange={handleSelect}
                      className="mr-1"
                    />
                    개인일정
                  </label>
                  <label>
                    <input
                      type="radio"
                      value={1} // 공개일정
                      checked={share === 1}
                      onChange={handleSelect}
                      className="mr-1"
                    />
                    공개일정
                  </label>
                </div>
                <div className="flex justify-center mt-2 w-64 justify-between">
                  <button
                    className="border-2 border-[#FF9A9A] bg-white rounded-md px-10 py-2 text-xl font-['BMJUA']"
                    onClick={handlePrevStep}
                  >
                    이전
                  </button>
                  <button
                    className="border-4 border-[#FF9A9A] bg-[#FF9A9A] rounded-md px-10 py-2 text-xl font-['BMJUA']"
                    onClick={savePlan}
                  >
                    생성
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="flex justify-center items-center flex-col">
                <div className="font-['Nanum Gothic'] text-2xl mb-6">
                  여행 장소 추가하러 가기!
                </div>
                <div className="flex justify-center mt-2 w-64 justify-between">
                  <button
                    className="border-2 border-[#FF9A9A] bg-white rounded-md px-2 py-2 text-md font-['BMJUA']"
                    onClick={goHome}
                  >
                    나중에 하기
                  </button>
                  <button
                    className="border-4 border-[#FF9A9A] bg-[#FF9A9A] rounded-md px-2 py-2 text-md font-['BMJUA']"
                    onClick={naviPage}
                  >
                    지금 하러 가기!
                  </button>
                </div>
              </div>
            )}
          </>
        </ModalBig>
      )}
    </>
  );
};
export default MakeTrip;
