import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const ViewNotice: React.FC = () => {
    const location = useLocation();
    const noticeData = {...location.state};
    const navigate = useNavigate();

    const goList = () => {
        navigate('/event');
    };

    return (
        <div className="w-full h-[90%] flex justify-center">
            <div className="w-5/6 h-[90%] flex flex-col items-center pt-12">
                <div className="h-[10%] font-['Nanum Gothic'] text-3xl mb-10 font-bold text-main-green-color ">
                    상세보기
                </div>
                <div className="w-4/5 h-[80%]">
                    <div className='flex flex-row items-center mb-5'>
                        <div className='bg-main-green-color w-[0.3rem] h-8 rounded'></div>
                        <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">제목</h1>
                        <div className="w-1/2 p-2 mx-2 rounded-md font-['Nanum Gothic']">
                            {noticeData.title}
                        </div>
                    </div>
                    <div className='flex flex-col mb-5 h-1/2'>
                        <div className="flex flex-row items-center mb-1">
                            <div className='bg-main-green-color w-[0.3rem] h-8 rounded'></div>
                            <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">내용</h1>
                        </div>
                        <div className="w-full p-2 rounded-md font-['Nanum Gothic']">
                            {noticeData.content}
                        </div>
                    </div>
                    <div className='flex flex-row items-center mb-3'>
                        <div className='bg-main-green-color w-[0.3rem] h-8 rounded'></div>
                        <h1 className="text-lg font-medium mx-3 font-semibold font-['Nanum Gothic']">첨부파일</h1>
                    </div>
                </div>
                <div className="w-full h-[10%] flex justify-center">
                    <button onClick={goList}
                            className="px-8 my-2 bg-main-green-color text-white rounded-md font-['Nanum Gothic'] font-bold text-xl">
                        목록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewNotice;
