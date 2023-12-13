import React, { useState } from 'react';

const AddPostBtn = ({ authTokens }) => {
  const [showModal, setShowModal] = useState(false);
  const [postFormData, setPostFormData] = useState({
    description: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostFormData({
      ...postFormData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setPostFormData({
      ...postFormData,
      image: e.target.files[0],
    });
  };

  const handleAddPostClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postFormData.description && !postFormData.image) {
        alert('Add image or description');
        return;
    }

    const formData = new FormData();
    formData.append('description', postFormData.description);
    formData.append('image', postFormData.image);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts/create/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: formData,
      });

      if (response.ok) {
        window.location.reload();
      } else { 
        console.log("error")
      }
    } catch (error) {
      console.error('error:', error);
    }

    closeModal();
  };

  return (
    <div className="buttons">
      <button className="add-post" onClick={handleAddPostClick}>
        Add Post
      </button>
      {showModal && (
        <div className="modal-background">
          <div className="modal">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Create Post</h2>
            <form onSubmit={handleSubmit} className="form-container">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={postFormData.description}
                onChange={handleInputChange}
              ></textarea>
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button type="submit">Add Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPostBtn;
