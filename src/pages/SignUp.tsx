import React, { useEffect } from 'react';
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
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [data, setData] = useState({
    name: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

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
  }) => {
    const { name, nickname, email, phone, password } = values;
    setData({
      name: name,
      nickname: nickname,
      email: email,
      phone: phone,
      password: password,
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
      const id = setTimeout(() => {
        navigate('/');
      }, 2000);
      setTimeoutId(id); // 타이머 ID 설정
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
      }}
      validationSchema={validationSchema}
      onSubmit={submit}
      validateOnMount={true}
    >
      {({ values, handleSubmit, handleChange, setFieldValue, errors }) => (
        <div className="max-w-sm mx-auto mt-8">
          <ToastContainer />
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="name"
                value={values.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-red-500">{errors.name}</div>
            </div>
            <div className="mb-4">
              <label htmlFor="nickname" className="block mb-1">
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={values.nickname}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-red-500">{errors.nickname}</div>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-red-500">{errors.email}</div>
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-1">
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
                className="w-full p-2 border rounded"
              />
              <div className="text-red-500">{errors.phone}</div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-red-500">{errors.password}</div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-2 bg-blue-500 text-white rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
