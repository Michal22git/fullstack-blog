import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FollowersButton = ({ userData, authTokens }) => {
  const [followersData, setFollowersData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleFollowersClick = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/profile/${userData.user.username}/follower/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFollowersData(data);
        setShowModal(true);
      } else {
        console.error('Failed to fetch followers data');
      }
    } catch (error) {
      console.error('Error fetching followers data:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className='buttons'>
      <button className="followers" onClick={handleFollowersClick}>
        Followers: {userData.followers_count}
      </button>
      {showModal && (
        <div className="modal-background">
          <div className="modal">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Followers</h2>
            <ul className="search-results">
              {followersData.map(follower => (
                <li key={follower.user.username} className="search-result-item">
                    <Link to={`/profile/${follower.user.username}`}>
                        <div className="user-info">
                            <img src={follower.image} alt="User Avatar" className="user-avatar" />
                            <p className="item-username">{follower.user.username}</p>
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

export default FollowersButton;
