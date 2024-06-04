import '../index.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
}

interface PlanDetailBoxProps {
  scheduleData: PlanData;
  planName: string;
}

const MyPlanDetailBox: React.FC<PlanDetailBoxProps> = ({
  scheduleData,
  planName,
}) => {
  const navigate = useNavigate();

  const toDiaryDetail = () => {
    console.log(scheduleData);
    navigate('/mydiarydetail', {
      state: { PlanData: scheduleData, planName: planName },
    });
  };

  const { time, locationName, title, content, imageUrl } = scheduleData;

  return (
    <div
      className="w-full h-[15%] p-5 flex rounded-md shadow-xl mb-5"
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-row items-center">
          <img src="icon-pencil.png" alt="일기 수정"
            className="h-3 w-3 cursor-pointer mr-4"
            onClick={toDiaryDetail} />
          <div className="flex flex-col w-full">
            <div className="w-fit flex flex-col justify-center items-start font-['BMJUA'] text-[#FF9A9A] text-md">
              {time}
              <span className="font-['BMJUA'] text-black text-md">{locationName.length > 13 ? `${locationName.slice(0, 12)}...` : locationName}</span>
            </div>
            <div className="w-full flex flex-1 font-['Nanum Gothic'] pr-2">{content}</div>
          </div>
        </div>
        <div className="w-[25%]">
          {imageUrl ? (
            <div className="w-full h-[60px]">
            <img
              src={imageUrl}
              className='w-full h-full object-cover'
              alt="일기사진"
            />
          </div>
          ) : (
            <div className="w-[100%] h-[60px] flex items-center justify-center">
              <div className="text-center text-main-green-color font-bold font-BMJUA text-xs">
                {title || content ? '' : '일기가 없습니다.'}
              </div>
            </div>
          )
          }
        </div>
      </div>
    </div >
  );
};

export default MyPlanDetailBox;
