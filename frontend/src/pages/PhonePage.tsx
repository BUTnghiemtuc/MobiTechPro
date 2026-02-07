import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService, type Product } from '../services/product.service';
import { cartService } from '../services/cart.service';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import BrandDiscovery from '../components/BrandDiscovery';

import { useSearchParams, useParams } from 'react-router-dom';

const PhonePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { keyword } = useParams();
  const searchQuery = keyword || searchParams.get('search');
  const API_BASE_URL = 'http://localhost:3000'; // Define base URL for images

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products with search keyword if present
        const response = await productService.getProducts(1, 20, searchQuery || '');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  // Combine fetched products (first 10) for sub-nav
  const subNavItems = products.slice(0, 10).map(p => ({
      name: p.title,
      isNew: true, // You might want real logic here
      image: getImageUrl(p.image_url),
      icon: undefined
  }));

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

  return (
    <div className="bg-white min-h-screen pt-28 pb-20"> 
       {/* Top Notification Bar */}
       <div className="bg-slate-50 py-3 text-center text-xs text-slate-600 border-b border-slate-100">
            Tìm quà ý nghĩa cho mọi người dịp Tết này. <Link to="/" className="text-blue-600 hover:underline">Mua sắm ngay &gt;</Link>
       </div>

       {/* Page Header */}
       <div className="container mx-auto px-6 py-10 md:py-16">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 md:mb-0">Sản Phẩm</h1>
            </div>

             {/* Sub Navigation - Featured Products Carousel */}
             {products.length > 0 && (
                 <div className="relative">
                     <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-6">Sản phẩm nổi bật</h3>
                     <div className="flex overflow-x-auto gap-4 pt-3 pb-6 scrollbar-hide snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
                         {subNavItems.map((item, index) => (
                             <Link 
                                 key={index} 
                                 to={`/products/${products[index]?.id}`}
                                 className="group snap-center shrink-0"
                             >
                                 <div className="flex flex-col items-center gap-3 w-28 md:w-32 overflow-visible">
                                     <div className="relative w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-2 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 group-hover:from-blue-50 group-hover:to-slate-100 overflow-visible">
                                         {item.image ? (
                                             <img 
                                                 src={item.image} 
                                                 alt={item.name} 
                                                 className="w-full h-full object-contain mix-blend-multiply scale-110"
                                             />
                                         ) : (
                                             <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                 <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                                     <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/>
                                                 </svg>
                                             </div>
                                         )}
                                         {item.isNew && (
                                             <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                                                 NEW
                                             </div>
                                         )}
                                     </div>
                                     <div className="text-center">
                                         <p className="text-xs font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                             {item.name}
                                         </p>
                                     </div>
                                 </div>
                             </Link>
                         ))}
                     </div>
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-full bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
                 </div>
             )}
       </div>

       {/* Brand Discovery Section */}
       <BrandDiscovery />

       {/* Main Section */}
       <section className="bg-slate-50 py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                     <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Khám phá dòng sản phẩm.</h2>
                        {searchQuery && (
                          <div className="flex items-center gap-2 mt-4">
                            <span className="text-slate-500">Showing results for:</span>
                            <span className="font-semibold text-slate-900 px-3 py-1 bg-slate-200 rounded-full flex items-center gap-2">
                              "{searchQuery}"
                              <button 
                                onClick={() => navigate('/phones')}
                                className="w-4 h-4 rounded-full bg-slate-300 hover:bg-slate-400 flex items-center justify-center text-xs text-slate-600 transition-colors"
                              >
                                ✕
                              </button>
                            </span>
                          </div>
                        )}
                     </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        No products found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <motion.div 
                                key={product.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center p-8 h-full"
                            >
                                <div className="w-full aspect-[4/5] mb-8 relative">
                                    <span className="absolute top-0 left-2 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                        New
                                    </span>
                                    {product.image_url ? (
                                        <img 
                                            src={getImageUrl(product.image_url)} 
                                            alt={product.title}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm">No Image</div>
                                    )}
                                </div>
                                
                                {/* Placeholder Colors (Real data might not have colors, so we keep static fallback or random for UI demo) */}
                                <div className="flex gap-2 mb-6">
                                    {['#8c8c89', '#f2f1eb', '#383838'].map((color, idx) => (
                                        <div 
                                            key={idx} 
                                            className="w-3 h-3 rounded-full shadow-inner border border-black/10"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{product.title}</h3>
                                {/* Truncate description as tagline */}
                                <p className="text-sm text-slate-500 mb-6 px-2 min-h-[40px] line-clamp-2">
                                    {product.description || 'Trải nghiệm đỉnh cao công nghệ.'}
                                </p>
                                <p className="text-base font-semibold text-slate-900 mb-6">
                                    ${(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toFixed(2)}
                                </p>
                                
                                <div className="mt-auto flex gap-3">
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Mua
                                    </button>
                                    <Link to={`/products/${product.id}`} className="px-5 py-2 text-blue-600 hover:underline text-sm font-medium">
                                        Tìm hiểu thêm &gt;
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
       </section>
    </div>
  );
};

export default PhonePage;
