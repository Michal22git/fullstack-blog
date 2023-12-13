import React, { useState, useEffect } from 'react';

const LikeBtn = ({ postData, authTokens }) => {
  const [liked, setLiked] = useState(postData.liked_by_user);

  useEffect(() => {
    setLiked(postData.liked_by_user);
  }, [postData]);

  const handleLike = async () => {
    const endpoint = liked ? 'unlike' : 'like';
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${endpoint}/${postData.id}/`, {
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`
        }
      });

      if (response.ok) {
        setLiked(!liked);
      } else {
        console.error('error');
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      style={{
        backgroundColor: liked ? 'green' : 'red',
        color: 'white',
        border: '1px solid black',
        padding: '5px 15px',
        cursor: 'pointer',
        borderRadius: '5px'
      }}
    >
      {liked ? 'Unlike' : 'Like'}
    </button>
  );
};

export default LikeBtn;
