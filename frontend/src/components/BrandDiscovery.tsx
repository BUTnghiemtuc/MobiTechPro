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
    // Always use the dedicated brand page route
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
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-xl font-bold text-slate-500 mb-8 uppercase tracking-widest text-center md:text-left">
          Khám Phá Thương Hiệu
        </h2>
        
        {/* Carousel Container with Navigation */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
          >
            {brands.map((brand) => (
              <Link 
                to={getBrandLink(brand)} 
                key={brand.id}
                className="relative snap-center shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] aspect-[4/5] rounded-[2rem] overflow-hidden group cursor-pointer"
              >
                {/* Background */}
                <div className={`absolute inset-0 ${brand.bgGradient || 'bg-gradient-to-br from-slate-900 to-black'}`}></div>
                
                {/* Image with Hover Scale */}
                {brand.imageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <motion.img 
                      src={brand.imageUrl} 
                      alt={brand.name}
                      className="w-full h-auto object-contain drop-shadow-2xl z-10 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Overlay Gradient for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20"></div>

                {/* Top Left Logo */}
                {brand.logoUrl && (
                  <div className="absolute top-6 left-6 z-30 opacity-90">
                    <img 
                      src={brand.logoUrl} 
                      alt={`${brand.name} logo`}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                )}

                {/* Bottom Content */}
                <div className="absolute bottom-6 left-6 right-6 z-30">
                  <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">Latest Collection</p>
                  
                  {/* Explore Button */}
                  <div className="flex items-center gap-2 text-white font-bold text-lg group/btn">
                    <span>Explore</span>
                    <motion.svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="w-5 h-5 stroke-current stroke-2 transition-transform duration-300 group-hover/btn:translate-x-1"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </motion.svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandDiscovery;
