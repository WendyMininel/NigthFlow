import React from 'react';
import './CategoryFilter.css';

const categories = [
  "eletronica", "rap/trap", "funk", "pop", "rock", "sertanejo", "pagode", "samba"
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-container">
      <div className="category-grid">
        <button
          className={`category-btn ${selectedCategory === 'todos' ? 'active' : ''}`}
          onClick={() => onSelectCategory('todos')}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
        <button
          className="category-btn others-btn"
          onClick={() => onSelectCategory('outros')}
        >
          outros
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;