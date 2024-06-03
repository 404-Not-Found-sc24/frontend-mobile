import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const cityparam = { ...location.state };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTermFromUrl = queryParams.get('q') || '';
    setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/searchtraveldes?q=${searchTerm}`, {
      state: {
        curr: cityparam.curr,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full h-12 flex justify-center my-3">
        <div className="w-11/12 h-full rounded-md shadow-xl flex items-center">
          <input
            type="text"
            className="text-gray-900 text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl rounded-lg block w-full ps-5 p-2.5 font-BMJUA focus:outline-0"
            placeholder="여행 도시를 검색해보세요!"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button type="submit" className="search relative right-3"></button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
