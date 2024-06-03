import '../index.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleData from '../../types/ScheduleData';

interface PlanBoxProps {
  props: ScheduleData;
}

const PlanBox: React.FC<PlanBoxProps> = (props) => {
  const { scheduleId, name, startDate, endDate, username, imageUrl } =
    props.props;
  const navigate = useNavigate();

  const toPlanDetail = () => {
    navigate('/plandetail', {
      state: { PlanData: props },
    });
  };

  return (
    <div
      className="w-full h-[30%] p-5 flex rounded-md shadow-xl mb-5"
      onClick={toPlanDetail}
    >
      <div className="flex h-[200px] items-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="지역소개사진"
            style={{ objectFit: 'cover', width: '250px', height: '180px' }}
          ></img>
        ) : (
          <div className="border-2 flex w-[250px] h-[180px] mt-2 text-gray-600 justify-center items-center">
            사진이 없습니다.
          </div>
        )}
      </div>
      <div className="flex flex-col ml-5 mt-2">
        <div className="font-['BMJUA'] text-2xl">{name}</div>
        <div className="font-['BMJUA'] text-[#ED661A] text-lg">
          {startDate} ~ {endDate}
        </div>
        <div className="font-['Nanum Gothic'] text-[#6E6E6E] text-sm mt-2">
          {username}
        </div>
      </div>
    </div>
  );
};

export default PlanBox;
