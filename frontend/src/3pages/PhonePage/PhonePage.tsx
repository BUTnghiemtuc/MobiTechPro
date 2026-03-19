import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService, type Product } from '../../1services/product.service';
import { formatPrice } from '../../2utils/format';
import { cartService } from '../../1services/cart.service';
import { useAuth } from '../../2context/AuthContext';
import { toast } from 'react-toastify';
import BrandDiscovery from '../../4components/BrandDiscovery/BrandDiscovery';
import { useSearchParams, useParams } from 'react-router-dom';

const PhonePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { keyword } = useParams();
  const searchQuery = keyword || searchParams.get('search');
  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Tăng limit lên 40 để hiển thị nhiều sản phẩm hơn
        const response = await productService.getProducts(1, 40, searchQuery || '');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const getImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Ngăn việc nhảy vào chi tiết sản phẩm khi nhấn nút Mua
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }
    
    try {
      await cartService.addToCart(product.id, 1);
      toast.success(`Đã thêm ${product.title} vào giỏ hàng`);
    } catch (error) {
      toast.error('Không thể thêm vào giỏ hàng');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Top Banner Thông báo */}
      <div className="bg-blue-600 text-white py-3 text-center text-sm font-medium shadow-inner">
        🎁 Tìm quà ý nghĩa cho mọi người dịp Tết này. 
        <Link to="/" className="ml-2 underline hover:text-blue-100 transition decoration-2 underline-offset-4">Mua sắm ngay &gt;</Link>
      </div>

      {/* Brand Discovery - Slider thương hiệu */}
      <BrandDiscovery />

      {/* Main Grid Section */}
      <section className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Title & Filter Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Khám phá dòng sản phẩm.
            </h1>
            {searchQuery && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-slate-500 font-medium">Kết quả cho:</span>
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-200">
                  "{searchQuery}"
                  <button 
                    onClick={() => navigate('/phones')}
                    className="hover:bg-blue-700 p-0.5 rounded-full transition"
                    title="Xóa bộ lọc"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500 font-semibold bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              Hiển thị: <span className="text-slate-900">{products.length} sản phẩm</span>
            </span>
          </div>
        </div>

        {/* Product Loader or Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-40 gap-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse">Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
             <div className="text-7xl mb-6">🔍</div>
             <p className="text-slate-800 text-2xl font-bold mb-2">Không tìm thấy sản phẩm phù hợp.</p>
             <p className="text-slate-400 mb-8 px-4">Hãy thử kiểm tra lại chính tả hoặc tìm kiếm bằng từ khóa khác.</p>
             <button 
              onClick={() => navigate('/phones')}
              className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg active:scale-95"
             >
               Xem tất cả sản phẩm
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -12 }}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer relative flex flex-col h-full"
              >
                {/* Image Section - Premium Look */}
                <div className="relative aspect-square flex items-center justify-center bg-slate-50 rounded-[2rem] mb-6 overflow-hidden group-hover:bg-white transition-colors duration-500">
                  <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 border border-white shadow-sm z-10">
                    New
                  </span>
                  
                  {product.image_url ? (
                    <img 
                      src={getImageUrl(product.image_url)} 
                      alt={product.title}
                      className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="text-slate-200 text-5xl">📷</div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Variant Colors (Static Placeholder for UI) */}
                <div className="flex justify-center gap-2.5 mb-5">
                  {['#b0b0b0', '#fceade', '#2a2a2a'].map((color, idx) => (
                    <div 
                      key={idx} 
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-sm ring-1 ring-slate-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col text-center px-1">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 h-14 mb-3">
                    {product.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {product.description || 'Sản phẩm công nghệ tiên tiến với hiệu năng vượt trội và thiết kế thời thượng.'}
                  </p>
                  
                  <div className="mt-auto">
                    <p className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
                      {formatPrice(product.price)}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full sm:w-auto bg-blue-600 text-white px-10 py-3.5 rounded-full font-bold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 active:scale-95 transition-all text-sm leading-none"
                      >
                        Mua ngay
                      </button>
                      <span className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors flex items-center gap-1">
                        Tìm hiểu thêm
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Support Section */}
      <section className="bg-slate-900 text-white py-20 mt-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Cần hỗ trợ thêm?</h2>
          <p className="text-slate-400 mb-10 text-lg">Liên hệ với đội ngũ chuyên gia của chúng tôi để được tư vấn sản phẩm phù hợp nhất.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition shadow-lg">Chat trực tuyến</button>
            <button className="border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition">Gọi: 1900 1234</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PhonePage;
