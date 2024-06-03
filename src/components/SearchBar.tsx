import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
  curr: string;
}

const SearchBar: React.FC<Props> = ({ curr }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTermFromUrl = queryParams.get('q') || '';
    setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  const mainhandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/searchplace?q=${searchTerm}`);
  };

  const planhandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/makeplan?q=${searchTerm}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      {curr === 'main' && (
        <form onSubmit={mainhandleSubmit}>
          <div className="w-full h-12 flex justify-center my-3">
            <div className="w-11/12 h-full rounded-md shadow-xl flex items-center">
              <input
                type="text"
                className="text-gray-900 text-md rounded-lg block w-full ps-5 p-2.5 font-BMJUA focus:outline-0"
                placeholder="궁금한 여행지를 검색해보세요!"
                onChange={handleChange}
                value={searchTerm}
              />
              <button
                type="submit"
                className="search relative right-3"
              ></button>
            </div>
          </div>
        </form>
      )}
      {curr === 'makeplan' && (
        <form onSubmit={planhandleSubmit}>
          <div className="w-full h-12 flex justify-center my-3">
            <div className="w-11/12 h-full rounded-md shadow-xl flex items-center">
              <input
                type="text"
                className="text-gray-900 text-md rounded-lg block w-full ps-5 p-2.5 font-BMJUA focus:outline-0"
                placeholder="궁금한 여행지를 검색해보세요!"
                onChange={handleChange}
                value={searchTerm}
              />
              <button
                type="submit"
                className="search relative right-3"
              ></button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default SearchBar;
