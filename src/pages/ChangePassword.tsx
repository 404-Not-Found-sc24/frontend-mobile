import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosError } from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';

interface ScheduleData {
  scheduleId: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  share: number;
  imageUrl: string;
}

interface UserInfo {
  memberId: number;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  role: string;
  imageUrl: string;
}

const ChangePassword: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const { refreshAccessToken, logout } = useAuth();
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // 타이머 ID 상태 추가

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, '비밀번호는 최소 8자리 이상입니다')
      .max(16, '비밀번호는 최대 16자리입니다!')
      .required('패스워드를 입력하세요!')
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s]*$/,
        '알파벳, 숫자, 공백을 제외한 특수문자를 모두 포함해야 합니다!',
      ),
    confirmPassword: Yup.string()
      .required('비밀번호를 다시 입력하세요.')
      .test(
        'passwords-match',
        '비밀번호가 일치하지 않습니다.',
        function (value) {
          return this.parent.newPassword === value;
        },
      ),
  });

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // 언마운트 시 타이머 제거
      }
    };
  }, [timeoutId]);

  const getUserInfo = async () => {
    try {
      const response = await axios.get('/auth', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserInfo(response.data);
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

  const submit = async (values: { password: string; newPassword: string }) => {
    const { password, newPassword } = values;
    try {
      await axios.patch(
        '/auth/change-password',
        { password, newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setShowSuccessPopup(true);
    } catch (e: any) {
      toast.error('비밀번호 변경에 실패했습니다. 😭', {
        position: 'top-center',
      });
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [refreshAccessToken]);

  const handleSuccessPopupClose = (data: UserInfo) => {
    setShowSuccessPopup(false);
    navigate('/mypage-setting', { state: { data } });
  };

  return (
    <div className="h-[90%]">
      <div className="h-[18rem]">
        <div className="w-full h-44 bg-main-red-color"></div>
        <div className="relative flex justify-center">
          {userInfo?.imageUrl == null ? (
            <img
              src={`${process.env.PUBLIC_URL}/image/user.png`}
              alt="유저 기본 이미지"
              className="absolute w-20 h-20 -top-10 bg-white rounded-full"
            />
          ) : (
            <img
              src={userInfo.imageUrl}
              alt="유저 프로필 이미지"
              className="absolute w-20 h-20 -top-10 bg-white rounded-full"
            />
          )}
          <h1 className="absolute top-12 text-3xl font-medium font-['BMJUA'] ">
            {userInfo?.nickname}
          </h1>
        </div>
      </div>
      <Formik
        initialValues={{
          password: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={submit}
        validateOnMount={true}
      >
        {({ values, handleSubmit, handleChange, isValid, errors }) => (
          <div className="w-11/12 mx-auto">
            <ToastContainer />
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-4">
                <label htmlFor="password" className="block mb-1">
                  현재 비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block mb-1">
                  새 비밀번호
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {values.newPassword && (
                  <div className="text-red-500">{errors.newPassword}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block mb-1">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {values.confirmPassword && (
                  <div className="text-red-500">{errors.confirmPassword}</div>
                )}
              </div>
              <button
                type="submit"
                disabled={!isValid}
                className={`w-full p-2 bg-main-red-color text-white rounded font-semibold tracking-wide focus:outline-none ${
                  !isValid
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-opacity-80'
                }`}
              >
                비밀번호 변경
              </button>
            </form>
          </div>
        )}
      </Formik>
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-3 rounded w-3/4 h-1/4 flex flex-col items-center">
            <div className="h-24 flex items-center font-[BMJUA] text-xl">
              비밀번호가 변경되었습니다.
            </div>
            <button
              onClick={() => {
                if (userInfo) {
                  handleSuccessPopupClose(userInfo);
                } else {
                  console.log('User info is not available');
                }
              }}
              className="w-16 text-white bg-main-red-color py-0.5 px-3 font-[BMJUA]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
