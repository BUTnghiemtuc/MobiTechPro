import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { productService, type Product } from '../1services/product.service';
import { cartService } from '../1services/cart.service';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const FlashSale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchFlashSaleProducts();
    
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchFlashSaleProducts = async () => {
    try {
      setLoading(true);
      // Fetch products 9-12 as "flash sale" items
      const response = await productService.getProducts(2, 4, '', '');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch flash sale products', error);
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-6">
        {/* Header with Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Title */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                ⚡ Flash Sale
              </h2>
              <p className="text-slate-400 text-lg">
                Giảm giá sốc chỉ trong hôm nay
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm uppercase tracking-wider mr-2">Kết thúc sau:</span>
              <div className="flex gap-2">
                {[
                  { value: timeLeft.hours, label: 'Giờ' },
                  { value: timeLeft.minutes, label: 'Phút' },
                  { value: timeLeft.seconds, label: 'Giây' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-gradient-to-br from-red-600 to-red-500 text-white rounded-xl px-4 py-3 min-w-[70px] shadow-lg">
                      <span className="text-2xl font-bold tabular-nums">
                        {item.value.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/products/${product.id}`)}
              className="group cursor-pointer relative"
            >
              {/* Discount Badge */}
              <div className="absolute -top-3 -right-3 z-20 bg-gradient-to-br from-yellow-400 to-orange-500 text-slate-900 font-bold text-sm px-4 py-2 rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                -30%
              </div>

              {/* Card */}
              <div className="relative h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl border border-red-500/30 overflow-hidden transition-all duration-500 hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-500/20">
                {/* Product Image */}
                <div className="relative aspect-[3/4] p-6 flex items-center justify-center bg-slate-900/30">
                  {product.image_url ? (
                    <img
                      src={getImageUrl(product.image_url)}
                      alt={product.title}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-slate-600 text-sm">No Image</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-white font-semibold text-base mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {product.title}
                  </h3>
                  
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-red-400">
                      ${((typeof product.price === 'string' ? parseFloat(product.price) : product.price) * 0.7).toFixed(0)}
                    </span>
                    <span className="text-sm text-slate-500 line-through">
                      ${(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toFixed(0)}
                    </span>
                  </div>

                  {/* Stock Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Đã bán: 45</span>
                      <span>Còn lại: 15</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-medium transition-all duration-300 hover:from-red-500 hover:to-red-400 active:scale-95 shadow-lg"
                  >
                    Mua ngay
                  </button>
                </div>

                {/* Pulsing Ring Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-red-500/0 group-hover:border-red-500/50 transition-all duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-3xl animate-pulse bg-red-500/5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
