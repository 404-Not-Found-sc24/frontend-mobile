import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const navigateToTravel = (curr: string) => {
    navigate('/traveldes', {
      state: {
        curr: curr,
      },
    });
  };

  return (
    <nav className="bg-white border-gray-200 h-[10%]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-5xl font-Dongle-Regular whitespace-nowrap text-main-green-color">
            나들이
          </span>
        </Link>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <div>
            {isAuthenticated ? (
              <ul className="font-5xl flex p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white items-center">
                <li>
                  <Link
                    to="/event"
                    className="py-4 px-3 item-center text-main-green-color font-BMJUA"
                  >
                    게시판
                  </Link>
                </li>
                <li>
                  <Link
                      to="/traveldes"
                      state= {{ curr: 'tour'}}
                      className="py-4 px-3 item-center text-main-green-color font-BMJUA"
                  >
                    여행지
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mypage"
                    className="py-4 px-3 item-center text-main-green-color font-BMJUA"
                  >
                    마이페이지
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    onClick={handleLogout}
                    className="py-2 px-3 border-2 border-white hover:border-main-green-color text-main-green-color font-BMJUA"
                  >
                    로그아웃
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="font-2xl flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white items-center">
                <li>
                  <Link
                    to="/signup"
                    className="py-2 px-3 md:p-0 text-main-green-color font-BMJUA"
                  >
                    회원가입
                  </Link>
                </li>
                <li className="flex-shrink-0" >
                  <Link
                    to="/signin"
                    className="py-2 px-3 border-2 border-white hover:border-main-green-color text-main-green-color font-BMJUA"
                  >
                    로그인
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
