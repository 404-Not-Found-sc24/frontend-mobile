import React, { useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLogin } = useAuth();

  useEffect(() => {
    const handleLogin = async () => {
      const params = new URLSearchParams(location.search);
      const authorizationCode = params.get("code");

      if (authorizationCode) {
        const loginData = {
          authorizationCode: authorizationCode,
          redirectUri: process.env.REACT_APP_REDIRECT_URI
        };

        try {
          const response = await axios.post(
            'https://api.nadueli.com/auth/oauth',
            loginData
          );

          if (response.status === 200) {
            const { accessToken, refreshToken, email, name, nickname, phone, role } =
              response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("email", email);
            localStorage.setItem("name", name);
            localStorage.setItem("nickname", nickname);
            localStorage.setItem("phone", phone);
            localStorage.setItem("role", role);

            alert("로그인이 완료되었습니다!");
            googleLogin();
            navigate("/");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              if (error.response.status === 404) {
                alert("회원가입되지 않은 사용자입니다.");
                navigate("/signup");
              } else {
                console.error("응답 에러:", error.response.data);
                navigate("/");
              }
            } else if (error.request) {
              console.error("응답 없음:", error.request);
              navigate("/");
            } else {
              console.error("요청 설정 에러:", error.message);
              alert(error.message);
              navigate("/");
            }
          }
        }
      } else {
        console.error("Missing URL parameters");
        navigate("/signIn");
      }
    };

    handleLogin();
  }, [location, navigate]);

  return (
    <div className="h-[90%]">
      <p>Redirecting...</p>
    </div>
  );
};

export default LoginSuccess;