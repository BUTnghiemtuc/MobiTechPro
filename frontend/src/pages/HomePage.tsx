import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService, type Product } from '../services/product.service';
import { cartService } from '../services/cart.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  // 👇 Hằng số URL Backend (Nên đưa vào file config chung sau này)
  const API_BASE_URL = 'http://localhost:3000';

  const fetchProducts = async (currentPage: number, search: string) => {
    setLoading(true);
    try {
      const response = await productService.getProducts(currentPage, 12, search); 
      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, keyword);
  }, [page, keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(1); 
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    try {
      await cartService.addToCart(product.id, 1);
      toast.success(`Added ${product.title} to cart`);
    } catch (error) {
      console.error('Add to cart failed', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleCreateProduct = () => {
    // ✅ FIX: Chuyển hướng sang trang tạo mới thay vì chỉ hiện Toast
    navigate('/admin/products/new');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll lên đầu trang cho trải nghiệm tốt hơn
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ Helper để lấy URL ảnh an toàn
  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url; // Nếu là ảnh online
    return `${API_BASE_URL}${url}`; // Nếu là ảnh từ server mình
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <form onSubmit={handleSearch} className="w-full md:w-1/2 flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* ✅ FIX: Kiểm tra quyền Admin/Staff */}
        {(user?.role === 'Staff' || user?.role === 'Admin') && (
          <button
            onClick={handleCreateProduct}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Create New Product
          </button>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
              <div className="h-48 bg-gray-200 w-full relative group">
                {product.image_url ? (
                  <img
                    // ✅ FIX: Dùng hàm getImageUrl để nối domain Backend
                    src={getImageUrl(product.image_url)}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        // Fallback nếu ảnh lỗi
                        e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                )}
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-2 truncate" title={product.title}>
                  {product.title}
                </h3>
                <p className="text-gray-600 font-bold mb-4">
                  ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}
                </p>
                <div className="mt-auto space-y-2">
                    <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                    Add to Cart
                    </button>
                    {/* Nếu là Staff/Admin thì hiện nút Edit nhanh */}
                    {(user?.role === 'Staff' || user?.role === 'Admin') && (
                        <button
                            onClick={() => navigate(`/admin/products/${product.id}`)}
                            className="w-full border border-gray-300 text-gray-700 py-1 rounded-lg hover:bg-gray-50 text-sm"
                        >
                            Edit Product
                        </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination (Giữ nguyên logic của bạn) */}
      {!loading && products.length > 0 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg border ${
              page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg border ${
              page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            Next
          </button>
        </div>
      )}
      
      {!loading && products.length === 0 && (
        <div className="text-center py-10 text-gray-500">No products found.</div>
      )}
    </div>
  );
};

export default HomePage;