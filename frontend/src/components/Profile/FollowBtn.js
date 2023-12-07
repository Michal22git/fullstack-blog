import React, { useState, useEffect } from 'react';

const FollowBtn = ({ userData, authTokens }) => {
  const [isFollowed, setIsFollowed] = useState(userData.followed);

  useEffect(() => {
    setIsFollowed(userData.followed);
  }, [userData]);

  const handleFollow = async () => {
    const endpoint = isFollowed ? 'unfollow' : 'follow';
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/profile/${userData.user.username}/${endpoint}/`, {
        method: isFollowed ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`
        }
      });

      if (response.ok) {
        setIsFollowed(!isFollowed);
      } else {
        console.error('error');
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <button onClick={handleFollow}>
      {isFollowed ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowBtn;
