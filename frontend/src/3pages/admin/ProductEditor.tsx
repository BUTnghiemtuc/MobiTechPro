import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../1services/product.service';
import { toast } from 'react-toastify';
import api from '../../1services/api';
import TagInput from '../../components/TagInput';

const ProductEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    image_url: '',
  });
  const [tags, setTags] = useState<any[]>([]); // State for selected tags
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      loadProduct(); 
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductById(Number(id));
      setFormData({
         title: data.title,
         description: data.description,
         price: Number(data.price),
         quantity: Number(data.quantity),
         image_url: data.image_url || ''
      });
      // Set existing tags
      if (data.tags) {
          setTags(data.tags);
      }

      // Load existing images
      if (data.images && data.images.length > 0) {
        const fullUrls = data.images.map((url: string) => 
          url.startsWith('http') ? url : `http://localhost:3000${url}`
        );
        setExistingImages(data.images);
        setImagePreviews(fullUrls);
      } else if (data.image_url) {
        // Fallback to single image
        const fullUrl = data.image_url.startsWith('http') ? data.image_url : `http://localhost:3000${data.image_url}`;
        setExistingImages([data.image_url]);
        setImagePreviews([fullUrl]);
      }
    } catch (error) {
       console.error("❌ Lỗi tải sản phẩm:", error);
       toast.error("Could not load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let newValue: any = value;
    
    if (name === 'price' || name === 'quantity') {
        newValue = value === '' ? '' : parseFloat(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate total count
    if (files.length + imageFiles.length > 5) {
      toast.error('Tối đa 5 ảnh');
      return;
    }
    
    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error('Chỉ chấp nhận file ảnh');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File quá lớn (tối đa 5MB)');
        return;
      }
    }
    
    // Add to image files
    setImageFiles(prev => [...prev, ...files]);
    
    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    const newExisting = [...existingImages];
    
    [newFiles[index], newFiles[index-1]] = [newFiles[index-1], newFiles[index]];
    [newPreviews[index], newPreviews[index-1]] = [newPreviews[index-1], newPreviews[index]];
    [newExisting[index], newExisting[index-1]] = [newExisting[index-1], newExisting[index]];
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    setExistingImages(newExisting);
  };

  const moveImageDown = (index: number) => {
    if (index === imagePreviews.length - 1) return;
    
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    const newExisting = [...existingImages];
    
    [newFiles[index], newFiles[index+1]] = [newFiles[index+1], newFiles[index]];
    [newPreviews[index], newPreviews[index+1]] = [newPreviews[index+1], newPreviews[index]];
    [newExisting[index], newExisting[index+1]] = [newExisting[index+1], newExisting[index]];
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    setExistingImages(newExisting);
  };

  const saveTags = async (productId: number) => {
      // 1. Get current tags of product (if edit mode) or empty (if new)
      // Since we don't have a "bulk sync" API, we can just "assign" all selected tags.
      // Our backend "assign" API checks for duplicates, so it's safe to call.
      // However, to support REMOVING tags, implementation is trickier with just "assign".
      // A proper solution requires a sync or manually diffing.
      
      // For testing/MVP: We will just Iterate and Assign all selected. 
      // AND we need to handle removed tags.
      
      // Let's implement a simple "Sync" logic here if we can.
      // But first, let's just make ADDING work so user can test "Autocomplete" and "Create New".
      // Removing is a nice to have but let's focus on adding first as requested.
      // Or... since we have the list, let's just call assign for everyone.
      
      // Better strategy:
      // If we are in Edit mode, we should fetch fresh tags then compare.
      // For now, let's just loop and assign all selected tags.
      
      const token = localStorage.getItem("token");
      
      if (tags.length > 0) {
          await Promise.all(tags.map(tag => 
              fetch('http://localhost:3000/api/tags/assign', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ productId, tagId: tag.id })
              })
          ));
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', (formData.price || 0).toString());
      submitData.append('quantity', (formData.quantity || 0).toString());
      
      // Append all image files
      imageFiles.forEach((file) => {
        submitData.append('images', file);
      });

      let productId = Number(id);

      if (isEditMode && id) {
        await api.put(`/products/${id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully');
      } else {
        const res = await api.post('/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        productId = res.data.id; // Get the new product ID
        toast.success('Product created successfully');
      }

      // Save Tags
      if (productId) {
          await saveTags(productId);
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error("❌ Submit Error:", error);
      if (error.response) {
          if(error.response.status === 403) {
              toast.error("⛔ Bạn không có quyền (Cần Admin/Staff)");
          } else {
              toast.error(`Lỗi: ${error.response.data.message || 'Failed to save'}`);
          }
      } else {
          toast.error('Lỗi kết nối mạng');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          {isEditMode ? 'Edit Product' : 'New Product'}
        </h1>
        <p className="text-slate-500 text-sm">Add or update product information</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Product Title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. iPhone 15 Pro Max"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border-slate-200 border p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price} 
                  onChange={handleChange}
                  className="w-full rounded-lg border-slate-200 border p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity (Stock)</label>
                <input
                  type="number"
                  name="quantity"
                  required
                  min="0"
                  step="1"
                  placeholder="0"
                  value={formData.quantity} 
                  onChange={handleChange}
                  className="w-full rounded-lg border-slate-200 border p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                />
              </div>
          </div>

          {/* Tag Input Integration */}
          <div>
             <TagInput 
                selectedTags={tags} 
                onTagsChange={setTags} 
                placeholder="Gõ để tìm kiếm hoặc tạo tag mới (VD: Pin khủng)"
             />
          </div>

          {/* Image Gallery Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Ảnh sản phẩm ({imagePreviews.length}/5)
            </label>
            
            <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <label className="cursor-pointer block text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleFiles}
                  className="hidden"
                />
                <div className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  Chọn ảnh (Tối đa 5, mỗi ảnh {'<'}5MB)
                </div>
              </label>
            </div>

            {/* Image Gallery Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((url, idx) => (
                  <div key={idx} className="relative group rounded-lg border-2 border-slate-200 overflow-hidden">
                    <img 
                      src={url} 
                      alt={`Product ${idx + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    
                    {/* Main badge */}
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-semibold">
                        Chính
                      </div>
                    )}
                    
                    {/* Actions - show on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImageUp(idx)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                          title="Di chuyển lên"
                        >
                          ⬆️
                        </button>
                      )}
                      {idx < imagePreviews.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImageDown(idx)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                          title="Di chuyển xuống"
                        >
                          ⬇️
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              rows={5}
              placeholder="Detailed product description..."
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border-slate-200 border p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-lg shadow-primary-500/20"
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;