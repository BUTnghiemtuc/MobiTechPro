import { useState, useEffect } from 'react';
import { brandService, type Brand } from '../../1services/brand.service';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import styles from './BrandManagement.module.css';

const BrandManagement = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#000000',
    bgGradient: 'bg-gradient-to-br from-slate-900 to-black',
    link: '',
    displayOrder: 0,
    isActive: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await brandService.getBrands();
      setBrands(data);
    } catch (error) {
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('color', formData.color);
    formDataToSend.append('bgGradient', formData.bgGradient);
    formDataToSend.append('link', formData.link);
    formDataToSend.append('displayOrder', formData.displayOrder.toString());
    formDataToSend.append('isActive', formData.isActive.toString());
    
    if (logoFile) {
      formDataToSend.append('logo', logoFile);
    }
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, formDataToSend);
        toast.success('Brand updated successfully');
      } else {
        await brandService.createBrand(formDataToSend);
        toast.success('Brand created successfully');
      }
      
      resetForm();
      fetchBrands();
    } catch (error) {
      toast.error('Failed to save brand');
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      color: brand.color || '#000000',
      bgGradient: brand.bgGradient || '',
      link: brand.link || '',
      displayOrder: brand.displayOrder,
      isActive: brand.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    try {
      await brandService.deleteBrand(id);
      toast.success('Brand deleted successfully');
      fetchBrands();
    } catch (error) {
      toast.error('Failed to delete brand');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#000000',
      bgGradient: 'bg-gradient-to-br from-slate-900 to-black',
      link: '',
      displayOrder: 0,
      isActive: true,
    });
    setLogoFile(null);
    setImageFile(null);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setLogoPreview(null);
    setImagePreview(null);
    setEditingBrand(null);
    setShowForm(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    } else {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  return (
    <div className="p-6">
      <div className={styles.div_1}>
        <h1 className={styles.h1_1}>Brand Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.el_1}
        >
          {showForm ? 'Cancel' : '+ Add Brand'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.motion_1}
        >
          <h2 className={styles.h2_1}>
            {editingBrand ? 'Edit Brand' : 'Create New Brand'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={styles.div_2}>
              <div>
                <label className={styles.label_1}>
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.el_2}
                />
              </div>

              <div>
                <label className={styles.label_1}>
                  Color (Hex)
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className={styles.el_3}
                />
              </div>

              <div>
                <label className={styles.label_1}>
                  Gradient Classes
                </label>
                <input
                  type="text"
                  value={formData.bgGradient}
                  onChange={(e) => setFormData({ ...formData, bgGradient: e.target.value })}
                  placeholder="bg-gradient-to-br from-blue-900 to-indigo-900"
                  className={styles.el_2}
                />
              </div>

              <div>
                <label className={styles.label_1}>
                  Link (Search Query)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/phones?search=apple"
                  className={styles.el_2}
                />
              </div>

              <div>
                <label className={styles.label_1}>
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  className={styles.el_2}
                />
              </div>

              <div className={styles.div_3}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className={styles.el_4}
                />
                <label htmlFor="isActive" className={styles.label_2}>
                  Active
                </label>
              </div>

              <div>
                <label className={styles.label_1}>
                  Logo Image
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className={styles.input_1}
                  />
                  {logoFile && (
                    <div className="space-y-2">
                      <div className={styles.div_4}>
                        <svg className={styles.svg_1} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        {logoFile.name}
                      </div>
                      {logoPreview && (
                        <div className={styles.div_5}>
                          <p className={styles.p_1}>Preview:</p>
                          <img src={logoPreview} alt="Logo preview" className={styles.img_1} />
                        </div>
                      )}
                    </div>
                  )}
                  {editingBrand?.logoUrl && !logoFile && (
                    <div className={styles.div_5}>
                      <p className={styles.p_1}>Current logo:</p>
                      <img src={editingBrand.logoUrl} alt="Current logo" className={styles.img_1} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={styles.label_1}>
                  Flagship Phone Image
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.input_1}
                  />
                  {imageFile && (
                    <div className="space-y-2">
                      <div className={styles.div_4}>
                        <svg className={styles.svg_1} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        {imageFile.name}
                      </div>
                      {imagePreview && (
                        <div className={styles.div_5}>
                          <p className={styles.p_1}>Preview:</p>
                          <img src={imagePreview} alt="Flagship preview" className={styles.img_2} />
                        </div>
                      )}
                    </div>
                  )}
                  {editingBrand?.imageUrl && !imageFile && (
                    <div className={styles.div_5}>
                      <p className={styles.p_1}>Current flagship image:</p>
                      <img src={editingBrand.imageUrl} alt="Current flagship" className={styles.img_2} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.div_6}>
              <button
                type="submit"
                className={styles.button_1}
              >
                {editingBrand ? 'Update Brand' : 'Create Brand'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className={styles.button_2}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Brands Table */}
      <div className={styles.div_7}>
        {loading ? (
          <div className={styles.div_8}>
            <div className={styles.div_9}></div>
          </div>
        ) : (
          <table className={styles.table_1}>
            <thead className="bg-gray-50">
              <tr>
                <th className={styles.th_1}>
                  Brand
                </th>
                <th className={styles.th_1}>
                  Order
                </th>
                <th className={styles.th_1}>
                  Status
                </th>
                <th className={styles.th_1}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={styles.tbody_1}>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td className={styles.td_1}>
                    <div className={styles.div_3}>
                      {brand.logoUrl && (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className={styles.img_3}
                        />
                      )}
                      <div className={styles.div_10}>{brand.name}</div>
                    </div>
                  </td>
                  <td className={styles.td_2}>
                    {brand.displayOrder}
                  </td>
                  <td className={styles.td_1}>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        brand.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {brand.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className={styles.td_3}>
                    <button
                      onClick={() => handleEdit(brand)}
                      className={styles.el_5}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className={styles.el_6}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BrandManagement;
