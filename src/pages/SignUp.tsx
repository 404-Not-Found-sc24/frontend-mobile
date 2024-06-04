import React from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [number, setNumber] = useState('');
  const [emailCheck, setEmailCheck] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [emailRequestLoading, setEmailRequestLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('이름을 입력하세요!'),
    email: Yup.string()
      .email('올바른 이메일 형식이 아닙니다!')
      .required('이메일을 입력하세요!'),
    nickname: Yup.string()
      .min(2, '닉네임은 최소 2글자 이상입니다!')
      .max(10, '닉네임은 최대 10글자입니다!')
      .matches(
        /^[가-힣a-zA-Z][^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/,
        '닉네임에 특수문자가 포함되면 안되고 숫자로 시작하면 안됩니다!',
      )
      .required('닉네임을 입력하세요!'),
    phone: Yup.string()
      .matches(/^[0-9-]+$/, '전화번호는 숫자만 포함해야 합니다!')
      .matches(/^\d{3}-\d{4}-\d{4}$/, '전화번호 형식이 올바르지 않습니다!')
      .required('전화번호를 입력하세요!'),
    password: Yup.string()
      .min(8, '비밀번호는 최소 8자리 이상입니다')
      .max(16, '비밀번호는 최대 16자리입니다!')
      .required('패스워드를 입력하세요!')
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s]*$/,
        '알파벳, 숫자, 공백을 제외한 특수문자를 모두 포함해야 합니다!',
      ),
    confirmPassword: Yup.string()
      .required('비밀번호를 다시 입력하세요.')
      .test('passwords-match', '비밀번호가 일치하지 않습니다.', function (value) {
        return this.parent.password === value;
      }),
  });

  const formatPhoneNumber = (phone: string) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const submit = async (values: {
    name: string;
    nickname: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { name, nickname, email, phone, password, confirmPassword } = values;
    setData({
      name: name,
      nickname: nickname,
      email: email,
      phone: phone,
      password: password,
      confirmPassword: confirmPassword
    });
    try {
      await axios.post('/auth/sign-up', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success(
        <h3>
          회원가입이 완료되었습니다.
          <br />
          로그인 하세요😎
        </h3>,
        {
          position: 'top-center',
          autoClose: 2000,
        },
      );
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (e: any) {
      toast.error(e.response.data.message + '😭', {
        position: 'top-center',
      });
    }
  };

  const emailRequest = async (email: String) => {
    if (!email || !Yup.string().email().isValidSync(email)) {
      toast.error('유효한 이메일을 입력하세요!', {
        position: 'top-center',
      });
      return;
    }

    try {
      setEmailRequestLoading(true);
      await axios.get(`/auth/duplicate?email=${email}`);

      toast.success(
        <h3>
          이메일로 인증번호를 발송했습니다.
        </h3>,
        {
          position: 'top-center',
          autoClose: 2000,
        },
      );

      setEmailRequested(true);
      setEmailRequestLoading(false);
    } catch (e: any) {
      toast.error(e.response.data.message + '😭', {
        position: 'top-center',
      });

      setEmailRequestLoading(false);
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
  };

  const handleEmailCheck = async (email: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.post(`/auth/emailCheck?email=${email}&code=${number}`);

      toast.success(
        <h3>
          이메일 인증이 완료되었습니다.
        </h3>,
        {
          position: 'top-center',
          autoClose: 2000,
        },
      );
      setEmailCheck(true);
    } catch (e: any) {
      toast.error(e.response.data.message + '😭', {
        position: 'top-center',
      });
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        phone: '',
        email: '',
        nickname: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={validationSchema}
      onSubmit={submit}
      validateOnMount={true}
    >
      {({ values, handleSubmit, handleChange, setFieldValue, isValid, errors }) => (
        <div className="w-11/12 mx-auto mt-8">
          <ToastContainer />
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 text-sm">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="name"
                value={values.name}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm"
              />
              {values.name && <div className="text-red-500 text-sm">{errors.name}</div>}
            </div>
            <div className="mb-4">
              <label htmlFor="nickname" className="block mb-1 text-sm">
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={values.nickname}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm"
              />
              {values.nickname && <div className="text-red-500 text-sm">{errors.nickname}</div>}
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="block mb-1 text-sm">
                이메일
              </label>
              <div className="flex flex-row justify-between">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  className="w-[75%] p-2 border rounded text-sm"
                />
                {emailRequestLoading ?
                  <div className='w-[20%] h-full flex justify-center'>
                    <img
                      src="Spinner.gif" alt="loading" className='w-[50%]'></img>
                  </div>
                  :
                  <button
                    type="button"
                    className={`w-[20%] bg-main-green-color text-sm rounded-lg text-white font-semibold tracking-wide focus:outline-none hover:bg-opacity-80 ${!values.email || errors.email ? 'opacity-30 cursor-not-allowed' : 'hover:bg-opacity-80 '
                      }`}
                    onClick={() => emailRequest(values.email)}
                    disabled={!values.email || !!errors.email}
                  >{emailRequested ? '재요청' : '인증 요청'}</button>

                }
              </div>
              {values.email && <div className="text-red-500 text-sm">{errors.email}</div>}
            </div>
            {emailRequested &&
              <div className="flex flex-row justify-between mb-4">
                <input
                  id="number"
                  name="number"
                  type="text"
                  value={number}
                  className="w-[75%] p-2 border rounded text-sm"
                  onChange={handleNumberChange} />
                {emailCheck ?
                  <div className="text-main-green-color w-[20%] flex justify-center items-center">
                    <div className="text-sm">
                      인증 완료
                    </div>
                  </div>
                  :
                  <button
                    type="button"
                    className={`w-[20%] bg-main-green-color rounded-lg  text-sm text-white font-semibold tracking-wide focus:outline-none ${!emailRequested || number.length !== 6 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-opacity-80 '
                      }`}
                    onClick={(e) => handleEmailCheck(values.email, e)}
                    disabled={!emailRequested || number.length !== 6}
                  >인증 확인</button>
                }
              </div>}
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-1 text-sm">
                전화번호
              </label>
              <input
                id="phone"
                name="phone"
                type="phone"
                value={values.phone}
                onChange={(e) => {
                  setFieldValue('phone', formatPhoneNumber(e.target.value));
                }}
                className="w-full p-2 border rounded text-sm"
              />
              {values.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 text-sm">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm"
              />
              {values.password && <div className="text-red-500">{errors.password}</div>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 text-sm">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm"
              />
              {values.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword}</div>}
            </div>
            <button
              type="submit"
              disabled={!isValid || !emailCheck || loading}
              className={`w-full p-2 bg-main-green-color text-sm text-white rounded font-semibold tracking-wide focus:outline-none ${!isValid || !emailCheck || loading ? 'opacity-30 cursor-not-allowed' : 'hover:bg-opacity-80'}`}
            >
              회원가입
            </button>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default SignUp;
