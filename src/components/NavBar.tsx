import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigateToTravel = (curr: string) => {
    navigate('/traveldes', {
      state: {
        curr: curr,
      },
    });
  };

  return (
    <nav className="h-[15%] bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-5xl font-Dongle-Regular whitespace-nowrap text-main-green-color">
            나들이
          </span>
        </Link>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zM3 10h14a1 1 0 010 2H3a1 1 0 010-2zM3 15h14a1 1 0 010 2H3a1 1 0 010-2z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div
          className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-5xl flex flex-col md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white items-center">
            {isAuthenticated ? (
              <>
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
                    state={{ curr: 'tour' }}
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
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/signup"
                    className="py-2 px-3 md:p-0 text-main-green-color font-BMJUA"
                  >
                    회원가입
                  </Link>
                </li>
                <li className="flex-shrink-0">
                  <Link
                    to="/signin"
                    className="py-2 px-3 border-2 border-white hover:border-main-green-color text-main-green-color font-BMJUA"
                  >
                    로그인
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
