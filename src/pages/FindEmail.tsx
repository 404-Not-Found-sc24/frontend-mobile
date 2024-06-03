import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const FindEmail: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // 타이머 ID 상태 추가

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // 언마운트 시 타이머 제거
      }
    };
  }, [timeoutId]);

  const navimain = () => {
    navigate('/');
  };

  const formatPhoneNumber = (inputPhone: string) => {
    console.log(inputPhone);
    const cleaned = ('' + inputPhone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return inputPhone;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedPhoneNumber);
  };

  const submit = async () => {
    try {
      await axios.post(
        '/auth/find-email',
        { name, phone },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      toast.success(
        <h3>
          비밀번호가 재발급 되었습니다.
          <br />
          다시 로그인 하세요😎
        </h3>,
        {
          position: 'top-center',
          autoClose: 2000,
        },
      );

      const id = setTimeout(() => {
        navigate('/');
      }, 2000);
      setTimeoutId(id);
    } catch (e: any) {
      toast.error('입력하신 이메일 아이디를 찾을 수 없습니다.' + '😭', {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="flex flex-col justify-center mx-auto mt-10 px-4">
      <button
        onClick={navimain}
        className="flex justify-center items-center text-6xl font-Dongle-Regular whitespace-nowrap text-main-green-color"
      >
        나들이
      </button>
      <div className="flex justify-center items-center mt-4 font-Nanum Gothic text-2xl ">
        이름과 전화번호를 입력해주세요.
      </div>
      <div className="mt-10 mx-auto w-[30%]">
        <input
          type="name"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg mt-2 border"
        />
      </div>
      <div className="mt-2 mx-auto w-[30%]">
        <input
          type="phone"
          placeholder="전화번호를 입력하세요"
          value={phone}
          onChange={handlePhoneChange}
          className="w-full px-4 py-3 rounded-lg mt-2 border"
        />
      </div>
      <div className="mt-6 mx-auto w-[30%]">
        <button
          type="submit"
          onClick={submit}
          className="w-full px-4 py-3 uppercase bg-main-red-color rounded-lg text-white font-semibold tracking-wide focus:outline-none hover:bg-opacity-80"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default FindEmail;
