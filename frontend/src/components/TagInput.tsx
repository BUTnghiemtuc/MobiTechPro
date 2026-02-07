import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

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
            console.error('Failed to fetch tags', error);
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
        // Check if existing
        const existingTag = availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
        
        if (existingTag) {
            if (!selectedTags.some(t => t.id === existingTag.id)) {
                onTagsChange([...selectedTags, existingTag]);
            }
        } else {
            // Create new tag
            // Random dark/vibrant color for better visibility
            const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            const token = localStorage.getItem('token');
            // console.log("Current Token in Frontend:", token); 
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
                setAvailableTags([...availableTags, newTag]); // Update local list
            } catch (error) {
                console.error('Failed to create tag', error);
                alert('Có lỗi khi tạo tag mới. Vui lòng đăng nhập quyền Admin/Staff.');
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

    // Quick select: top 5 distinct tags from available list (just taking first 5 for now as we don't have stats in list api yet)
    // Or we could fetch stats, but let's just use availableTags for simplicity for now.
    const quickTags = availableTags
        .filter(t => !selectedTags.some(selected => selected.id === t.id))
        .slice(0, 5); 

    return (
        <div className="w-full" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags sản phẩm</label>
            
            {/* Quick Select Bar */}
            {quickTags.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 py-1">Gợi ý:</span>
                    {quickTags.map(tag => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => selectSuggestion(tag)}
                            className="text-xs px-2 py-1 rounded-full border border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                            + {tag.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="relative border border-gray-300 rounded-md p-2 flex flex-wrap gap-2 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white min-h-[42px]">
                {selectedTags.map(tag => (
                    <span 
                        key={tag.id} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-white text-sm"
                        style={{ backgroundColor: tag.color || '#6b7280' }}
                    >
                        {tag.name}
                        <button
                            type="button"
                            onClick={() => removeTag(tag.id)}
                            className="ml-1 text-white/80 hover:text-white focus:outline-none"
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
                    className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                />

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {suggestions.map(tag => (
                            <li
                                key={tag.id}
                                onClick={() => selectSuggestion(tag)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center justify-between group"
                            >
                                <span>{tag.name}</span>
                                <span 
                                    className="w-3 h-3 rounded-full opacity-50 group-hover:opacity-100" 
                                    style={{ backgroundColor: tag.color }}
                                ></span>
                            </li>
                        ))}
                    </ul>
                )}
                 {/* Show "Create new" prompt if no suggestions match and input has value */}
                 {showSuggestions && suggestions.length === 0 && inputValue.trim() && (
                    <ul className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                         <li
                            onClick={() => addTag(inputValue.trim())}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-blue-600"
                        >
                            Tạo mới tag "<strong>{inputValue}</strong>"
                        </li>
                    </ul>
                 )}
            </div>
            <p className="mt-1 text-xs text-gray-500">Nhập tên tag và nhấn Enter để thêm mới.</p>
        </div>
    );
};

export default TagInput;
