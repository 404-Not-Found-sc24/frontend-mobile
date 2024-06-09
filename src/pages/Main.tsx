import React from 'react';

const Main: React.FC = () => {
  return (
    <div className="w-full h-[90%] flex justify-center items-center">
      <div className="container h-[80%] flex flex-col justify-center items-center">
        <div className="flex flex-col w-[80%] ml-20 text-left text-3xl sm:text-4xl md:text-4xl lg:text-6xl xl:text-6xl font-['BMHANNAPro']">
          <p className="text-main-red-color ">국내 여행을</p>
          <p>한손에서 간편하게</p>
        </div>
        <div className="w-[60%] h-[80%] mt-5 px-2 overflow-hidden shadow-xl md:my-4 lg:my-12 xl:my-4 rounded-2xl">
          <div className="flex item-center justify-center w-full h-full">
            <img
              src="/image/mainImage.png"
              alt="메인페이지 이미지"
              className=" w-[100%] h-[100%] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Main;
