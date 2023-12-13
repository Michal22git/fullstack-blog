import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import LikeBtn from '../../components/Post/LikeBtn';
import Comments from '../../components/Post/Comments';
import AuthContext from '../../context/AuthContex';

function Home() {
  const { authTokens } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/posts/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
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

    fetchPosts();
  }, [authTokens]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {posts.map(post => (
        <div key={post.id} className="home-post">
          <div className='left-image'>
            <img
              className='full-image'
              src={post.image}
              alt="Post avatar"
            />
          </div>
          <div className='right-content'>
            <div className="author-info">
              <img src={post.profile.image} alt="Author Avatar" />
              <Link to={`/profile/${post.profile.user.username}`}>
                <p>{post.profile.user.username}</p> 
              </Link>
              <LikeBtn postData={post} authTokens={authTokens} />
            </div>
            <div className="post-info">
              <p>{post.description}</p>
              <i>{new Date(post.created_time).toLocaleString()}</i>
            </div>
            <Comments selectedPost={post} authTokens={authTokens} />
          </div>
        </div>

      ))}

    </div>
  );
}

export default Home;
