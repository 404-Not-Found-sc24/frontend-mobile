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

  const { time, locationName, content, imageUrl } = scheduleData;

  return (
    <div
      className="w-full h-[15%] p-5 flex rounded-md shadow-xl mb-5"
      onClick={toDiaryDetail}
    >
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-row w-[75%]">
          <div className="font-['BMJUA'] text-[#FF9A9A] text-xl mr-3">
            {time}
          </div>
          <div className="flex flex-col">
            <div className="font-['BMJUA'] text-lg">{locationName.length > 7 ? `${locationName.slice(0, 6)}...` : locationName}</div>
            <div className="font-['Nanum Gothic'] text-md pr-2">{content}</div>
          </div>
        </div>
        <div className="w-[25%]">
          {imageUrl ? (
            <img
              src={imageUrl}
              className="w-full object-cover"
              alt="일기사진"
              style={{ maxWidth: '100%' }}
            />
          ) : (
            <div
              className="w-full border-2 text-center flex items-center justify-center"
              style={{ maxWidth: '100%' }}>
              No Image
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MyPlanDetailBox;
