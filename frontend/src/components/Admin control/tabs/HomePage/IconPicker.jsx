// src/components/Admin control/tabs/HomePage/IconPicker.jsx
import React, { useState } from 'react';
import { iconCategories } from './iconData';

const IconPicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const getAllIcons = () => {
    let icons = [];
    Object.values(iconCategories).forEach(category => {
      icons = [...icons, ...category];
    });
    return icons;
  };

  const getCategoryIcons = () => {
    if (activeCategory === 'all') {
      let icons = getAllIcons();
      if (searchTerm) {
        icons = icons.filter(icon => 
          icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          icon.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return icons;
    }
    
    let icons = iconCategories[activeCategory] || [];
    if (searchTerm) {
      icons = icons.filter(icon => 
        icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return icons;
  };

  const categories = ['all', 'Development', 'Design', 'Marketing & SEO', 'AI & Technology', 'Business & Office', 'Process Steps', 'Default'];
  const displayIcons = getCategoryIcons();

  return (
    <div className="icon-picker-container">
      <label>{label || 'Icon'}</label>
      <div className="icon-picker-input" onClick={() => setIsOpen(!isOpen)}>
        <div className="selected-icon">
          {value && <i className={`fas ${value}`} style={{ fontSize: '20px', color: '#cc7722', marginRight: '10px' }}></i>}
          <span>{value ? value.replace('fa-', '') : 'Select an icon'}</span>
          <i className="fas fa-chevron-down" style={{ marginLeft: 'auto', color: '#999' }}></i>
        </div>
      </div>

      {isOpen && (
        <div className="icon-picker-dropdown">
          <div className="icon-picker-search">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="icon-picker-categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          <div className="icon-picker-grid">
            {displayIcons.map(icon => (
              <div
                key={icon.value}
                className={`icon-option ${value === icon.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange({ target: { name: 'icon', value: icon.value } });
                  setIsOpen(false);
                }}
              >
                <i className={`fas ${icon.value}`}></i>
                <span>{icon.label}</span>
              </div>
            ))}
            {displayIcons.length === 0 && (
              <div className="no-icons">No icons found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;