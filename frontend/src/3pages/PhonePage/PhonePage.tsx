import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService, type Product } from '../../1services/product.service';
import { cartService } from '../../1services/cart.service';
import { useAuth } from '../../2context/AuthContext';
import { toast } from 'react-toastify';
import BrandDiscovery from '../../4components/BrandDiscovery/BrandDiscovery';

import { useSearchParams, useParams } from 'react-router-dom';
import styles from './PhonePage.module.css';

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
       {/* Top Notification Bar */}
       <div className={styles.div_2}>
            Tìm quà ý nghĩa cho mọi người dịp Tết này. <Link to="/" className={styles.Link_1}>Mua sắm ngay &gt;</Link>
       </div>



       {/* Brand Discovery Section */}
       <BrandDiscovery />

       {/* Main Section */}
       <section className={styles.section_1}>
            <div className={styles.div_3}>
                <div className={styles.div_4}>
                     <div>
                        <h2 className={styles.h2_1}>Khám phá dòng sản phẩm.</h2>
                        {searchQuery && (
                          <div className={styles.div_5}>
                            <span className="text-slate-500">Showing results for:</span>
                            <span className={styles.span_1}>
                              "{searchQuery}"
                              <button 
                                onClick={() => navigate('/phones')}
                                className={styles.el_1}
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
                    <div className={styles.div_6}>
                        <div className={styles.div_7}></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className={styles.div_8}>
                        No products found.
                    </div>
                ) : (
                    <div className={styles.div_9}>
                        {products.map((product) => (
                            <motion.div 
                                key={product.id}
                                whileHover={{ scale: 1.02 }}
                                className={styles.motion_1}
                            >
                                <div className={styles.div_10}>
                                    <span className={styles.span_2}>
                                        New
                                    </span>
                                    {product.image_url ? (
                                        <img 
                                            src={getImageUrl(product.image_url)} 
                                            alt={product.title}
                                            className={styles.img_1}
                                        />
                                    ) : (
                                        <div className={styles.div_11}>No Image</div>
                                    )}
                                </div>
                                
                                {/* Placeholder Colors (Real data might not have colors, so we keep static fallback or random for UI demo) */}
                                <div className={styles.div_12}>
                                    {['#8c8c89', '#f2f1eb', '#383838'].map((color, idx) => (
                                        <div 
                                            key={idx} 
                                            className={styles.div_13}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                <h3 className={styles.h3_1}>{product.title}</h3>
                                {/* Truncate description as tagline */}
                                <p className={styles.p_1}>
                                    {product.description || 'Trải nghiệm đỉnh cao công nghệ.'}
                                </p>
                                <p className={styles.p_2}>
                                    ${(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toFixed(2)}
                                </p>
                                
                                <div className={styles.div_14}>
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        className={styles.el_2}
                                    >
                                        Mua
                                    </button>
                                    <Link to={`/products/${product.id}`} className={styles.Link_2}>
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
