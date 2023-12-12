import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FollowingButton = ({ userData, authTokens }) => {
  const [followingData, setFollowingData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleFollowingClick = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/profile/${userData.user.username}/following/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFollowingData(data);
        setShowModal(true);
      } else {
        console.error('Failed to fetch following data');
      }
    } catch (error) {
      console.error('Error fetching following data:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className='buttons'>
      <button className="following" onClick={handleFollowingClick}>
        Following: {userData.following_count}
      </button>
      {showModal && (
        <div className="modal-background">
          <div className="modal">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Following</h2>
            <ul className="search-results">
                {followingData.map(following => (
                    <li key={following.user.username} className="search-result-item">
                        <Link to={`/profile/${following.user.username}`}>
                            <div className="user-info">
                                <img src={following.image} alt="User Avatar" className="user-avatar" />
                                <p className="item-username">{following.user.username}</p>
                            </div>
                        </Link>    
                    </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowingButton;
