import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Comments = ({ selectedPost, authTokens }) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const addComment = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/comment/${selectedPost.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: JSON.stringify({ content: newComment })
      });
      if (response.ok) {
        console.log("Added comment")
        setNewComment('');
      } else {
        console.error('Error adding comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="add-comment">
          <textarea value={newComment} onChange={handleCommentChange} placeholder="Add comment..." />
          <button onClick={addComment}>Submit</button>
      </div>
      <div className="comments-section">
          {selectedPost.comments.map(comment => (
              <div key={comment.id} className="comment">
              <div className='author-info'>
                  <img src={comment.profile.image} alt="Author Avatar" />
                  <Link to={`/profile/${comment.profile.user.username}`}>
                  <p>{comment.profile.user.username}</p>
                  </Link>  
              </div>
              <p>{comment.content}</p>
              <i>{new Date(comment.created_time).toLocaleString()}</i>
              </div>
          ))}
      </div>
    </>    
  );
};

export default Comments;
