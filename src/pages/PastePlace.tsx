import * as React from 'react';
import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import '../Calendar.css';
import MakePlan from './MakePlan';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ModalMid from "../components/ModalMid";
import ScheduleData from "../../types/ScheduleData";

interface props {
  isOpen: boolean;
  locationId: number;
  handleCloseModal: () => void;
}

const PastePlace = ({ isOpen, locationId, handleCloseModal }: props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const { accessToken, refreshAccessToken } = useAuth();
  const navigate = useNavigate();
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [hour, setHour] = useState<number | string>('');
  const [minute, setMinute] = useState<number | string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    if (hour !== '' && minute !== '') {
      const formattedHour = String(hour).padStart(2, '0');
      const formattedMinute = String(minute).padStart(2, '0');
      setSelectedTime(`${formattedHour}:${formattedMinute}`);
    }
  }, [hour, minute]);

  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHour(value === '' ? '' : parseInt(value, 10));
  };

  const handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinute(value === '' ? '' : parseInt(value, 10));
  };

  useEffect(() => {
    if (selectedSchedule) {
      const startDate = new Date(selectedSchedule.startDate);
      const endDate = new Date(selectedSchedule.endDate);
      const dateArray: string[] = [];
      let currentDate = startDate;
      console.log(startDate);
      console.log(endDate);
      while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setDates(dateArray);
      console.log(dateArray);
    }
  }, [selectedSchedule]);

  const handleScheduleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value, 10);
    const schedule = schedules.find((s) => s.scheduleId === selectedId) || null;
    setSelectedSchedule(schedule);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    getSchedules();
  }, []);

  useEffect(() => {
    // externalParameter에 변화가 있을 때만 modalOpen 상태를 변경
    if (isOpen !== modalOpen) {
      setModalOpen(isOpen);
    }
  }, [isOpen]);

  const goHome = useCallback(() => {
    navigate('/');
  }, []);

  const getSchedules = async () => {
    try {
      const response = await axios
          .get('/schedule/list', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
          .then((response) => {
            console.log(response);
            setSchedules(response.data);
          });
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

  const pastePlace = async () => {
    try {
      const requestData = {
        locationId: locationId,
        scheduleId: selectedSchedule? selectedSchedule.scheduleId : '',
        date: selectedDate,
        time: selectedTime,
      };

      console.log("req", requestData);
      
      await axios
          .post('/tour/schedules', requestData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            console.log(response);
            navigate(-1);
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
        <ModalMid onClose={handleCloseModal}>
          <div className="flex justify-center items-center flex-col">
            <div className="font-['BMJUA'] text-2xl mb-6">
              내 일정에 <span className="text-[#ff9a9a]">장소 추가</span>하기
            </div>
            <>
              <div className="flex w-full flex-col">
                <div className="mb-3">
                  <div className="flex flex-row justify-start">
                    <div className="bg-main-red-color w-[5px] h-[20px] rounded-lg"></div>
                    <div className="font-['BMJUA'] text-md ml-2">일정 명</div>
                  </div>
                  <div className="flex">
                    <select
                        className="w-full h-[50px] rounded-md shadow-xl px-3 font-['Nanum Gothic'] text-md font-bold"
                        onChange={handleScheduleChange}>
                      <option value="basic" selected disabled>일정 선택</option>
                      {schedules.map((schedule) => (
                          <option key={schedule.scheduleId} value={schedule.scheduleId}>
                            {schedule.name}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex flex-row justify-start">
                    <div className="bg-main-red-color w-[5px] h-[20px] rounded-lg"></div>
                    <div className="font-['BMJUA'] text-md ml-2">날짜</div>
                  </div>
                  <div className="flex">
                    <select
                        className="w-full h-[50px] rounded-md shadow-xl px-3 font-['Nanum Gothic'] text-md font-bold"
                        onChange={handleDateChange}>
                      <option value="basic" selected disabled>날짜 선택</option>
                      {dates.map((date) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="flex flex-row justify-start">
                    <div className="bg-main-red-color w-[5px] h-[20px] rounded-lg"></div>
                    <div className="font-['BMJUA'] text-md ml-2">시간</div>
                  </div>
                  <div className="flex text-2xl items-center">
                    <input
                        type="number"
                        value={hour}
                        onChange={handleHourChange}
                        className="w-[90px] h-[40px] rounded-md shadow-xl px-3 font-['Nanum Gothic'] text-md font-bold mr-3"
                        min="0"
                        max="23"
                        placeholder="HH"/> :
                    <input
                        type="number"
                        value={minute}
                        onChange={handleMinuteChange}
                        className="w-[90px] h-[40px] rounded-md shadow-xl px-3 font-['Nanum Gothic'] text-md font-bold ml-3"
                        min="0"
                        max="59"
                        placeholder="MM"/>
                  </div>
                </div>
              </div>
              <button
                  className="border-4 border-[#FF9A9A] bg-[#FF9A9A] rounded-md px-8 py-2 text-xl font-['BMJUA']"
                  onClick={pastePlace}
              >
                확인
              </button>
            </>
          </div>
        </ModalMid>
      )}
    </>
  );
};
export default PastePlace;
