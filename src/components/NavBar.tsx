import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Close the menu when the location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="h-[10%] bg-white border-gray-200 relative z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-3xl font-Dongle-Regular whitespace-nowrap text-main-green-color">
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
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}
        id="navbar-default"
      >
        <ul className="flex flex-col mt-10 items-start pl-4">
          {isAuthenticated ? (
            <>
              {/* <li>
                <Link
                  to="/event"
                  className="py-4 px-3 item-center text-main-green-color font-BMJUA"
                >
                  게시판
                </Link>
              </li> */}
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
    </nav>
  );
};

export default NavBar;
