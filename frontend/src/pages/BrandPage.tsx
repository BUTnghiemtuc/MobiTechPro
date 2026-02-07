import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService, type Product } from '../services/product.service';
import { brandService, type Brand } from '../services/brand.service';
import { cartService } from '../services/cart.service';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Brand theme configurations
const brandThemes: Record<string, {
  primary: string;
  gradient: string;
  textColor: string;
  hoverBorder: string;
}> = {
  apple: {
    primary: '#000000',
    gradient: 'from-slate-900 via-slate-800 to-black',
    textColor: 'text-white',
    hoverBorder: 'hover:border-slate-800',
  },
  samsung: {
    primary: '#1428A0',
    gradient: 'from-blue-900 via-blue-800 to-indigo-900',
    textColor: 'text-white',
    hoverBorder: 'hover:border-blue-600',
  },
  xiaomi: {
    primary: '#FF6900',
    gradient: 'from-orange-600 via-orange-500 to-red-600',
    textColor: 'text-white',
    hoverBorder: 'hover:border-orange-500',
  },
  oppo: {
    primary: '#00A368',
    gradient: 'from-green-700 via-green-600 to-emerald-700',
    textColor: 'text-white',
    hoverBorder: 'hover:border-green-500',
  },
  vivo: {
    primary: '#0066CC',
    gradient: 'from-blue-700 via-blue-600 to-cyan-700',
    textColor: 'text-white',
    hoverBorder: 'hover:border-blue-500',
  },
  default: {
    primary: '#1e293b',
    gradient: 'from-slate-800 via-slate-700 to-slate-900',
    textColor: 'text-white',
    hoverBorder: 'hover:border-slate-600',
  },
};

const BrandPage = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [brandData, setBrandData] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:3000';

  const theme = brandThemes[brandName?.toLowerCase() || 'default'] || brandThemes.default;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products filtered by brand
        const productsResponse = await productService.getProducts(1, 50, brandName || '');
        setProducts(productsResponse.data);

        // Try to fetch brand data
        try {
          const brandsResponse = await brandService.getActiveBrands();
          const brand = brandsResponse.find(
            b => b.name.toLowerCase() === brandName?.toLowerCase()
          );
          setBrandData(brand || null);
        } catch (error) {
          console.log('Brand data not available');
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brandName]);

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
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

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Dynamic Hero Section */}
      <section className={`relative bg-gradient-to-br ${theme.gradient} py-20 md:py-32 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {brandData?.logoUrl && (
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src={brandData.logoUrl}
                alt={brandData.name}
                className="h-16 md:h-24 w-auto mx-auto mb-8 drop-shadow-2xl"
              />
            )}
            
            <h1 className={`text-5xl md:text-7xl font-bold ${theme.textColor} mb-4 tracking-tight`}>
              {brandName?.charAt(0).toUpperCase() + brandName?.slice(1)}
            </h1>
            
            <p className={`text-lg md:text-xl ${theme.textColor} opacity-90 max-w-2xl mx-auto`}>
              Khám phá bộ sưu tập sản phẩm mới nhất
            </p>

            {brandData?.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <img
                  src={brandData.imageUrl}
                  alt={`${brandData.name} flagship`}
                  className="h-64 md:h-96 w-auto mx-auto drop-shadow-2xl"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900 transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link to="/phones" className="hover:text-slate-900 transition-colors">Sản phẩm</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{brandName}</span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Tất cả sản phẩm {brandName}
            </h2>
            <span className="text-slate-500">
              {products.length} sản phẩm
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-slate-500 mb-6">Hiện tại chưa có sản phẩm nào của thương hiệu này</p>
              <Link
                to="/phones"
                className="inline-block px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-2xl overflow-visible shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent ${theme.hoverBorder} flex flex-col`}
                >
                  <Link to={`/products/${product.id}`} className="block p-6">
                    <div className="aspect-square mb-4 relative">
                      {product.image_url ? (
                        <img
                          src={getImageUrl(product.image_url)}
                          alt={product.title}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                          No Image
                        </div>
                      )}
                      <span className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                        New
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      {product.description || 'Trải nghiệm công nghệ đỉnh cao'}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-xl font-bold text-slate-900">
                        ${(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toFixed(2)}
                      </p>
                    </div>
                  </Link>

                  <div className="px-6 pb-6 mt-auto">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-3 rounded-xl font-semibold transition-all duration-300"
                      style={{
                        backgroundColor: theme.primary,
                        color: 'white',
                      }}
                    >
                      Thêm vào giỏ
                    </button>
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

export default BrandPage;
