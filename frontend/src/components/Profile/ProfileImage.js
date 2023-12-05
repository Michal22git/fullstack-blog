import React, { useState } from 'react';

const ProfileImage = ({ imageUrl, userData, authTokens }) => {
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    setNewImage(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
  formData.append('image', newImage);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/profile/update/picture/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authTokens.access}`
        },
        body: formData
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
    <>
      <img
        src={imageUrl}
        alt="User Avatar"
        className="avatar"
        onClick={openModal}
      />
      {showModal && (
        <div className="modal-background">
          <div className="modal">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Update Profile Picture</h2>
            <form onSubmit={handleSubmit} className="form-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileImage;
