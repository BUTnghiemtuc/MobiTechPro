import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { productService, type Product } from '../1services/product.service';
import { cartService } from '../1services/cart.service';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      // Fetch first 8 products as "best sellers"
      const response = await productService.getProducts(1, 8, '', '');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch best sellers', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
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

  if (loading) {
    return (
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center text-slate-500">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-slate-950">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Sản phẩm Bán chạy
          </h2>
          <p className="text-slate-400 text-lg">
            Những sản phẩm được yêu thích nhất
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/products/${product.id}`)}
              className="group cursor-pointer"
            >
              {/* Glassmorphism Card */}
              <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
                {/* Product Image */}
                <div className="relative aspect-[3/4] p-8 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={getImageUrl(product.image_url)}
                      alt={product.title}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-slate-600 text-sm">No Image</div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Product Info */}
                <div className="p-6 pt-0">
                  <h3 className="text-white font-semibold text-lg mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {product.title}
                  </h3>
                  
                  {/* Pricing */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Sale Price */}
                    <span className="text-2xl font-bold text-white">
                      ${(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toFixed(0)}
                    </span>
                    {/* Original Price (mock 20% discount) */}
                    <span className="text-sm text-slate-500 line-through">
                      ${((typeof product.price === 'string' ? parseFloat(product.price) : product.price) * 1.2).toFixed(0)}
                    </span>
                  </div>

                  {/* Add to Cart Button (appears on hover) */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:from-blue-500 hover:to-blue-400 active:scale-95"
                  >
                    Thêm vào giỏ
                  </button>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
