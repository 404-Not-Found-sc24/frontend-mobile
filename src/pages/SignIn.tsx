import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, refreshAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      if ((error as AxiosError).response) {
        const responseData: any = (error as AxiosError).response!.data;

        if (responseData?.message) {
          // 서버에서 받은 오류 메시지가 있는 경우 출력
          toast.error(responseData.message, {
            position: 'top-center',
          });
        } else {
          // 기타 오류의 경우 기본 오류 메시지 출력
          toast.error('로그인에 실패했습니다.', {
            position: 'top-center',
          });
        }
      } else {
        toast.error('로그인에 실패했습니다.', {
          position: 'top-center',
        });
      }
    }
  };

  const handleFindPassword = () => {
    navigate('/findpassword');
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <h1 className="text-3xl font-semibold text-center">로그인</h1>
      <ToastContainer />
      <form className="mt-6" onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-main-green-color focus:bg-white focus:outline-none"
          />
        </div>
        <div className="mt-4">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-main-green-color focus:bg-white focus:outline-none"
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-3 uppercase bg-main-green-color rounded-lg text-white font-semibold tracking-wide focus:outline-none hover:bg-opacity-80"
          >
            로그인
          </button>
        </div>
        <div className="flex items-center justify-center">
          <button type="button" className="p-4">
            아이디 찾기
          </button>
          <div className="p-4"> | </div>
          <button type="button" onClick={handleFindPassword} className="p-4">
            비밀번호 찾기
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
