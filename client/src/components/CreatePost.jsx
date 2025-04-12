import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('News/Discussion');
  const [severity, setSeverity] = useState('Medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userData);
    if (user.role !== 'Resident') {
      navigate('/dashboard');
      return;
    }
  }, [navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const postData = {
        title,
        content,
        category
      };
      
      // Add category-specific data
      if (category === 'Emergency Alert') {
        postData.severity = severity;
      }
      
      await axios.post('http://localhost:5000/api/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Redirect to posts page after successful creation
      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      setLoading(false);
      console.error('Error creating post:', err);
    }
  };
  
  return (
    <div className="container mt-4">
      <h2>Create New Post</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Post Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="News/Discussion">News & Discussion</option>
            <option value="Help Request">Help Request</option>
            <option value="Emergency Alert">Emergency Alert</option>
          </select>
        </div>
        
        {/* Show severity field only for Emergency Alerts */}
        {category === 'Emergency Alert' && (
          <div className="mb-3">
            <label className="form-label">Emergency Severity</label>
            <select
              className="form-select"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        )}
        
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        
        <div className="mb-3">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary ms-2"
            onClick={() => navigate('/posts')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
