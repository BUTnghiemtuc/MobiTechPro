import React, { useState, useEffect, useRef } from 'react';
import api from '../../1services/api';
import styles from './TagInput.module.css';

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ selectedTags, onTagsChange, placeholder = "Nhập tag..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTags();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      setAvailableTags(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tags', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      const filtered = availableTags.filter(tag => 
        tag.name.toLowerCase().includes(value.toLowerCase()) &&
        !selectedTags.some(selected => selected.id === tag.id)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        await addTag(inputValue.trim());
      }
    }
  };

  const addTag = async (tagName: string) => {
    const existingTag = availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    
    if (existingTag) {
      if (!selectedTags.some(t => t.id === existingTag.id)) {
        onTagsChange([...selectedTags, existingTag]);
      }
    } else {
      // Bảng màu đẹp để random
      const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.");
        return;
      }

      try {
        const response = await api.post('/tags', { 
          name: tagName, 
          color: randomColor 
        });

        const newTag = response.data;
        onTagsChange([...selectedTags, newTag]);
        setAvailableTags([...availableTags, newTag]); 
      } catch (error) {
        console.error('Lỗi khi tạo tag mới', error);
        alert('Có lỗi khi tạo tag mới. Vui lòng đảm bảo bạn có quyền Admin/Staff.');
      }
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagId: number) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId));
  };

  const selectSuggestion = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  // Gợi ý nhanh: Lấy 5 tags đầu tiên chưa được chọn
  const quickTags = availableTags
    .filter(t => !selectedTags.some(selected => selected.id === t.id))
    .slice(0, 5); 

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <label className={styles.label}>Tags sản phẩm</label>
      
      {/* Thanh Gợi ý nhanh */}
      {quickTags.length > 0 && (
        <div className={styles.quickSelectBox}>
          <span className={styles.quickSelectLabel}>Gợi ý:</span>
          {quickTags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => selectSuggestion(tag)}
              className={styles.quickSelectBtn}
            >
              + {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* Khu vực nhập và hiển thị Tag */}
      <div className={styles.inputContainer}>
        {selectedTags.map(tag => (
          <span 
            key={tag.id} 
            className={styles.tagBadge}
            style={{ backgroundColor: tag.color || '#6b7280' }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className={styles.removeBtn}
              aria-label={`Xóa tag ${tag.name}`}
            >
              &times;
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ""}
          className={styles.inputField}
        />

        {/* Dropdown Gợi ý khi gõ */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.dropdown}>
            {suggestions.map(tag => (
              <li
                key={tag.id}
                onClick={() => selectSuggestion(tag)}
                className={styles.dropdownItem}
              >
                <span>{tag.name}</span>
                <span 
                  className={styles.colorDot} 
                  style={{ backgroundColor: tag.color }}
                ></span>
              </li>
            ))}
          </ul>
        )}
        
        {/* Lựa chọn "Tạo mới" nếu gõ không trúng tag nào */}
        {showSuggestions && suggestions.length === 0 && inputValue.trim() && (
          <ul className={styles.dropdown}>
            <li
              onClick={() => addTag(inputValue.trim())}
              className={styles.createNewItem}
            >
              Tạo mới tag "<strong>{inputValue}</strong>"
            </li>
          </ul>
        )}
      </div>
      <p className={styles.helpText}>Nhập tên tag và nhấn Enter để thêm mới.</p>
    </div>
  );
};

export default TagInput;