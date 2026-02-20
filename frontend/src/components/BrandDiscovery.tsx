import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { brandService, type Brand } from '../services/brand.service';

const BrandDiscovery = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await brandService.getActiveBrands();
      setBrands(data);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBrandLink = (brand: Brand) => {
    return `/brand/${brand.name.toLowerCase()}`;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-6">
          <div className="text-center text-slate-500">Loading brands...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header with modern styling */}
        <div className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 text-center md:text-left"
          >
            Khám Phá Thương Hiệu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-center md:text-left"
          >
            Khám phá bộ sưu tập mới nhất từ các thương hiệu hàng đầu
          </motion.p>
        </div>
        
        {/* Carousel Container with Navigation */}
        <div className="relative">
          {/* Left Arrow - Modern Design */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-40 bg-white/80 backdrop-blur-md hover:bg-white border border-slate-200 shadow-lg rounded-full p-4 transition-all duration-300 hover:scale-110 hover:shadow-xl hidden md:flex items-center justify-center group"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow - Modern Design */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-40 bg-white/80 backdrop-blur-md hover:bg-white border border-slate-200 shadow-lg rounded-full p-4 transition-all duration-300 hover:scale-110 hover:shadow-xl hidden md:flex items-center justify-center group"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-5 md:gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
          >
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="snap-center shrink-0 w-[85%] sm:w-[70%] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <Link 
                  to={getBrandLink(brand)} 
                  className="relative block aspect-[3/4] rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  {/* Background with modern gradient */}
                  <div className={`absolute inset-0 ${brand.bgGradient || 'bg-gradient-to-br from-slate-900 via-slate-800 to-black'}`}></div>
                  
                  {/* Glassmorphism overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Phone Image - Fixed Width */}
                  {brand.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center px-8 py-12">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative w-full max-w-[280px] h-full flex items-center justify-center"
                      >
                        <img 
                          src={brand.imageUrl} 
                          alt={brand.name}
                          className="w-full h-auto max-h-full object-contain drop-shadow-2xl z-10 rounded-2xl"
                        />
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </motion.div>
                    </div>
                  )}

                  {/* Gradient overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-20"></div>

                  {/* Brand Logo - Top Left */}
                  {brand.logoUrl && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="absolute top-6 left-6 z-30"
                    >
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                        <img 
                          src={brand.logoUrl} 
                          alt={`${brand.name} logo`}
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Bottom Content - Modern Design */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {/* Tag */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-white/90 text-xs font-medium uppercase tracking-wider">Latest Collection</span>
                    </div>
                    
                    {/* Brand Name */}
                    <h3 className="text-white font-bold text-2xl mb-3 drop-shadow-lg">{brand.name}</h3>
                    
                    {/* Explore Button - Enhanced */}
                    <div className="flex items-center gap-3 text-white font-semibold text-base group/btn">
                      <span className="relative">
                        Khám Phá Ngay
                        <span className="absolute bottom-0 left-0 w-0 group-hover/btn:w-full h-0.5 bg-white transition-all duration-300"></span>
                      </span>
                      <motion.svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="w-5 h-5 stroke-current stroke-2 transition-transform duration-300 group-hover/btn:translate-x-2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </motion.svg>
                    </div>
                  </div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/20 transition-all duration-500 z-40 pointer-events-none"></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for scrollbar hide and gradient */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
};

export default BrandDiscovery;
