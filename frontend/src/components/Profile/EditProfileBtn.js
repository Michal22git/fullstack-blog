import React, { useState } from 'react';

const EditProfileButton = ({ userData, authTokens }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: userData.user.username,
    email: userData.user.email,
    description: userData.description,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditProfileClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/profile/update/info/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          description: formData.description
        })
      });
  
      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  
    closeModal();
  };

  return (
    <div className='buttons'>
      <button className="edit-profile" onClick={handleEditProfileClick}>
        Edit Profile
      </button>
      {showModal && (
        <div className="modal-background">
          <div className="modal">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="form-container">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfileButton;
