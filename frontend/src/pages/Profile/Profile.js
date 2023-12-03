import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContex';
import FollowingButton from '../../components/Profile/FollowingBtn';
import FollowersButton from '../../components/Profile/FollowersBtn';

const Profile = () => {
  const { authTokens, user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/profile/${username}/`, {
            method:'GET',
            headers:{
              'Authorization': `Bearer ${authTokens.access}`
            }
        })

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (authTokens && username) {
      fetchUserData();
    }
  }, [authTokens, username]);

  let memberSince = '';
  if (userData && userData.user && userData.user.date_joined) {
    const dateJoined = new Date(userData.user.date_joined);
    const today = new Date();

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const differenceInMilliseconds = today - dateJoined;
    const differenceInDays = Math.floor(differenceInMilliseconds / millisecondsPerDay);

    memberSince = `Member since: ${new Date(userData.user.date_joined).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} (${differenceInDays} days)`;
  }

  const isOwnProfile = user && user.username === username;

  return (
    <div className="container">
      {userData ? (
        <div className="profile">
          <img 
            src={userData.image} 
            alt="User Avatar" 
            className="avatar" 
          />
          <div className="info">
            <p className="username">{userData.user.username}</p>
            <p>{userData.user.email}</p>
            <p>{userData.description}</p>
            <div className="buttons">
              <FollowingButton userData={userData} authTokens={authTokens} />
              <FollowersButton userData={userData} authTokens={authTokens} />
            </div>
            <div className="buttons">  
              {isOwnProfile && (
                <>
                  <button className='action-btn'>Add Post</button>
                  <button className='action-btn'>Edit Profile</button>
                </>
              )}
            </div>
            <p>{memberSince}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;