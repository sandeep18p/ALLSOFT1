import React, { useState } from 'react';
import './TagInput.css';

const TagInput = ({ tags, onChange, placeholder = 'Add tags...' }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleRemove = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="tag-input-container">
      <div className="tags-display">
        {tags.map((tag, index) => (
          <span key={index} className="tag-badge">
            {tag}
            <button
              type="button"
              className="tag-remove"
              onClick={() => handleRemove(tag)}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="form-control tag-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TagInput;

