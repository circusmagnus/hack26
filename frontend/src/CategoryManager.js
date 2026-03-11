import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [message, setMessage] = useState('');

  const fetchCategories = () => {
    fetch('http://localhost:3001/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    setMessage('');

    fetch('http://localhost:3001/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newCategoryName }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setNewCategoryName('');
          fetchCategories();
          setMessage('Category added successfully!');
        }
      })
      .catch(error => console.error('Error adding category:', error));
  };

  const handleDeleteCategory = (id) => {
    setMessage('');
    if (window.confirm('Are you sure you want to delete this category?')) {
      fetch(`http://localhost:3001/categories/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.status === 204) {
            fetchCategories();
            setMessage('Category deleted successfully!');
          } else {
            return response.json().then(data => {
              setMessage(data.message || 'Error deleting category.');
            });
          }
        })
        .catch(error => console.error('Error deleting category:', error));
    }
  };

  return (
    <div>
      <Link to="/">Back to Notes</Link>
      <h1>Manage Categories</h1>

      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New Category Name"
        />
        <button type="submit">Add Category</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Existing Categories</h2>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul>
          {categories.map(category => (
            <li key={category.id}>
              {category.name}
              <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryManager;
