import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContex';

const Search = () => {
  const { authTokens } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const searchUser = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/profile/search/${searchTerm}/`, {
          headers: {
            'Authorization': `Bearer ${authTokens.access}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          console.error('error');
        }
      } catch (error) {
        console.error('error:', error);
      }
    };

    if (searchTerm !== '') {
      searchUser();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, authTokens]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />
      <ul className="search-results">
        {searchResults.map((result) => (
          <li key={result?.id} className="search-result-item">
            {result && result.user ? (
              <Link to={`/profile/${result.user.username}`}>
                <div className="user-info">
                  <img src={result.image} alt="User Avatar" className="user-avatar" />
                  <p className="item-username">{result.user.username}</p>
                </div>
              </Link>
            ) : (
              <p>No user data available</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
