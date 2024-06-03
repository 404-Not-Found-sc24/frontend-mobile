import React, { useCallback, useEffect, useState } from 'react';
import Map from '../components/Map';
import { MapProvider } from '../context/MapContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PastePlace from './PastePlace';

interface Diary {
  userName: string;
  title: string;
  date: string;
  weather: string;
  content: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

const DiaryDetail: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const Diary = location.state.PlanData;
  const locationId = location.state.locationId;
  const [diaryData, setDiaryData] = useState<Diary>();

  useEffect(() => {
    getData();
  }, []);

  const initialMarkers =
    Diary && diaryData
      ? [
          {
            placeId: Diary.placeId,
            latitude: diaryData.latitude,
            longitude: diaryData.longitude,
          },
        ]
      : [];

  const initialCenter = diaryData
    ? { latitude: diaryData.latitude, longitude: diaryData.longitude }
    : { latitude: 37.2795, longitude: 127.0438 };

  const naviBack = () => {
    window.history.back();
  };

  const getData = async () => {
    console.log("Diary", Diary);
    try {
      await axios
        .get(`/tour/diary/${Diary.diaryId}`, {
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

  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="flex w-full h-[90%]">
      <div className="w-1/2 h-full">
        <div className="flex w-full h-[10%]">
          <i
            className="backArrow ml-2 cursor-pointer w-[10%]"
            onClick={naviBack}
          ></i>
          <div className="flex items-center w-[90%]">
            <div className="font-['BMJUA'] text-3xl text-black ml-2 flex items-center">
              {Diary.title}
            </div>
            <div className="font-['BMJUA'] text-xl text-[#ED661A] ml-5 flex items-center">
              {Diary.date}
            </div>
          </div>
        </div>
        <div className="w-full h-[90%] flex justify-center">
          <div className="w-5/6 h-full mb-5">
            <div className="w-full h-full flex flex-col pt-3">
              <div className="w-full h-[95%] flex flex-col py-5 rounded-md shadow-xl">
                <div className="flex justify-between h-[10%] mx-5 items-center">
                  <div className="flex w-[50%] items-center">
                    <div className="font-['BMJUA'] text-[#FF9A9A] text-xl mr-5">
                      {Diary.time}
                    </div>
                    <div className="font-['BMJUA'] text-2xl">
                      {Diary.locationName}
                    </div>
                  </div>
                  <button
                    className="w-20 h-7 bg-black rounded-2xl text-white font-['Nanum Gothic'] text-sm font-semibold"
                    onClick={() => handleOpenModal()}
                  >
                    가져오기
                  </button>
                </div>
                <div className="flex justify-center h-fit m-5">
                  <img
                    src={Diary.imageUrl}
                    width="250px"
                    alt="지역소개사진"
                  ></img>
                </div>
                <div className="mx-10 my-5 h-full">
                  <div className="flex justify-between">
                    <div className="font-['Nanum Gothic'] font-bold text-lg">
                      {Diary.title}
                    </div>
                    <div className="font-bold font-['Nanum Gothic']">
                      {diaryData ? diaryData.weather : ''}
                    </div>
                  </div>
                  <div className="font-['Nanum Gothic'] mt-3">
                    {Diary.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PastePlace
          isOpen={isOpen}
          locationId={locationId}
          handleCloseModal={handleCloseModal}
        />
      </div>
      <MapProvider
        key={JSON.stringify(initialMarkers)}
        initialCenter={initialCenter}
        initialMarkers={initialMarkers}
      >
        <Map />
      </MapProvider>
    </div>
  );
};

export default DiaryDetail;
