import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService, type Product } from '../../1services/product.service';
import { brandService, type Brand } from '../../1services/brand.service';
import { cartService } from '../../1services/cart.service';
import { useAuth } from '../../2context/AuthContext';
import { toast } from 'react-toastify';
import styles from './BrandPage.module.css';

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

  const getImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
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
    <div className={styles.div_1}>
      {/* Dynamic Hero Section */}
      <section className={`relative bg-gradient-to-br ${theme.gradient} py-20 md:py-32 overflow-hidden`}>
        <div className={styles.div_2}>
          <div className={styles.div_3}></div>
        </div>
        
        <div className={styles.div_4}>
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
                className={styles.motion_1}
              />
            )}
            
            <h1 className={`text-5xl md:text-7xl font-bold ${theme.textColor} mb-4 tracking-tight`}>
              {brandName ? brandName.charAt(0).toUpperCase() + brandName.slice(1) : ''}
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
                  className={styles.img_1}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className={styles.div_5}>
        <div className={styles.div_6}>
          <div className={styles.div_7}>
            <Link to="/" className={styles.Link_1}>Trang chủ</Link>
            <span>/</span>
            <Link to="/phones" className={styles.Link_1}>Sản phẩm</Link>
            <span>/</span>
            <span className={styles.span_1}>{brandName}</span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className={styles.section_1}>
        <div className={styles.div_8}>
          <div className={styles.div_9}>
            <h2 className={styles.h2_1}>
              Tất cả sản phẩm {brandName}
            </h2>
            <span className="text-slate-500">
              {products.length} sản phẩm
            </span>
          </div>

          {loading ? (
            <div className={styles.div_10}>
              <div className={styles.div_11}></div>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.div_12}>
              <div className={styles.div_13}>📱</div>
              <h3 className={styles.h3_1}>Không tìm thấy sản phẩm</h3>
              <p className={styles.p_1}>Hiện tại chưa có sản phẩm nào của thương hiệu này</p>
              <Link
                to="/phones"
                className={styles.Link_2}
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <div className={styles.div_14}>
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-2xl overflow-visible shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent ${theme.hoverBorder} flex flex-col`}
                >
                  <Link to={`/products/${product.id}`} className={styles.Link_3}>
                    <div className={styles.div_15}>
                      {product.image_url ? (
                        <img
                          src={getImageUrl(product.image_url)}
                          alt={product.title}
                          className={styles.img_2}
                        />
                      ) : (
                        <div className={styles.div_16}>
                          No Image
                        </div>
                      )}
                      <span className={styles.span_2}>
                        New
                      </span>
                    </div>

                    <h3 className={styles.h3_2}>
                      {product.title}
                    </h3>
                    
                    <p className={styles.p_2}>
                      {product.description || 'Trải nghiệm công nghệ đỉnh cao'}
                    </p>

                    <div className={styles.div_17}>
                      <p className={styles.p_3}>
                        ${(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toFixed(2)}
                      </p>
                    </div>
                  </Link>

                  <div className={styles.div_18}>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={styles.el_1}
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
