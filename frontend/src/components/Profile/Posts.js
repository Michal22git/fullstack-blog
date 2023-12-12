import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LikeBtn from './LikeBtn';

const Posts = ({ authTokens }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/posts/${username}/`, {
          headers: {
            'Authorization': `Bearer ${authTokens.access}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserPosts(data);
          setLoading(false);
        } else {
          console.error('error');
          setLoading(false);
        }
      } catch (error) {
        console.error('error:', error);
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username, authTokens.access]);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="posts-container">
      <h2>Posts</h2>
      <div className="posts-grid">
        {userPosts.map(post => (
          <div key={post.id} className="post-item" onClick={() => openModal(post)}>
            <img src={post.image} alt="User Avatar" />
            <div className="post-details">
              <p>Likes: {post.likes.length}</p>
              <p>Comments: {post.comments.length}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedPost && (
        <div className="modal-background">
          <div className="modal-post">
            <div className='left-image'>
              <img
                className='full-image'
                src={selectedPost.image}
                alt="Post avatar"
              />
            </div>
            <div className='right-content'>
              <div className="author-info">
                <img src={selectedPost.profile.image} alt="Author Avatar" />
                <Link to={`/profile/${selectedPost.profile.user.username}`}>
                  <p>{selectedPost.profile.user.username}</p>
                </Link>
                <LikeBtn postData={selectedPost} authTokens={authTokens} />
              </div>
              <div className="post-info">
                <p>{selectedPost.description}</p>
                <i>{new Date(selectedPost.created_time).toLocaleString()}</i>
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
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
