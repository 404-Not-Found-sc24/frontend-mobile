import React from 'react';
import SearchBar from '../components/SearchBar';
const Main: React.FC = () => {
    return (
        <div>
            <div className="w-full flex justify-center mt-10">
                <div className="w-2/3 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                    <SearchBar curr={'main'}/>
                </div>
            </div>
            <div className="flex justify-center mt-[5%]">
                <div className="container flex flex-row justify-between w-[80%] mt-12">
                    <div
                        className="flex flex-col justify-center w-1/2 text-left text-2xl sm:text-4xl md:text-4xl lg:text-6xl xl:text-6xl font-['BMHANNAPro']">
                        <p className="text-main-red-color ">국내 여행을</p>
                        <p>한손에서 간편하게</p>
                    </div>
                    <div className="w-1/2 h-auto px-4 overflow-hidden shadow-xl md:my-4 lg:my-12 xl:my-4 rounded-2xl">
                        <div className="relative flex item-center justify-center w-full h-full">
                            <img
                                src="/image/나들이.png"
                                alt="메인페이지 이미지"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Main;