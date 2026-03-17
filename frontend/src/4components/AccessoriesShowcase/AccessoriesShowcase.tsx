import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { productService, type Product } from '../../1services/product.service';
import { cartService } from '../../1services/cart.service';
import { useAuth } from '../../2context/AuthContext';
import { toast } from 'react-toastify';

const AccessoriesShowcase = () => {
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      // Fetch products 13-18 as "accessories"
      const response = await productService.getProducts(3, 6, '', '');
      setAccessories(response.data);
    } catch (error) {
      console.error('Failed to fetch accessories', error);
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
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Phụ kiện đi kèm
          </h2>
          <p className="text-slate-400 text-lg">
            Hoàn thiện trải nghiệm của bạn
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {accessories.map((accessory, index) => (
            <motion.div
              key={accessory.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/products/${accessory.id}`)}
              className={`group cursor-pointer ${index % 7 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              {/* Compact Card */}
              <div className="relative h-full bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
                {/* Product Image with light background */}
                <div className={`relative ${index % 7 === 0 ? 'aspect-square' : 'aspect-[3/4]'} bg-slate-100 p-4 flex items-center justify-center`}>
                  {accessory.image_url ? (
                    <img
                      src={getImageUrl(accessory.image_url)}
                      alt={accessory.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-slate-400 text-xs">No Image</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 bg-slate-800/80 backdrop-blur-sm">
                  <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {accessory.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      ${(typeof accessory.price === 'string' ? parseFloat(accessory.price) : accessory.price).toFixed(0)}
                    </span>
                    
                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, accessory)}
                      className="p-2 bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-500 active:scale-90"
                      title="Add to cart"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/30 rounded-2xl transition-all duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => navigate('/accessories')}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 border border-slate-700"
          >
            <span>Xem tất cả phụ kiện</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AccessoriesShowcase;
