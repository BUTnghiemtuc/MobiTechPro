import { motion } from 'framer-motion';
import heroBanner from '../../assets/hero_flagship_smartphone.png';
import ValueProposition from '../../4components/ValueProposition/ValueProposition';
import BrandDiscovery from '../../4components/BrandDiscovery/BrandDiscovery';
import BestSellers from '../../4components/BestSellers/BestSellers';
import FlashSale from '../../4components/FlashSale/FlashSale';
import AdvertisingBanner from '../../4components/AdvertisingBanner/AdvertisingBanner';
import AccessoriesShowcase from '../../4components/AccessoriesShowcase/AccessoriesShowcase';
import TechBlog from '../../4components/TechBlog/TechBlog';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative w-full h-screen min-h-[700px] flex flex-col justify-center items-center text-center overflow-hidden bg-black">
        <div className="z-10 px-6 max-w-4xl mx-auto mt-20 fade-in-up">
            <h2 className="text-secondary-400 font-semibold tracking-widest uppercase text-sm mb-4">New Arrival</h2>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
                iPhone 17 Pro Max
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
                Titanium. So strong. So light. So Pro.
            </p>
            <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-full font-medium transition-all hover:scale-105"
                >
                    Buy Now
                </button>
                <button 
                  className="text-primary-400 hover:text-white px-8 py-3 font-medium transition-colors flex items-center gap-2 group"
                >
                    Learn more <span className="group-hover:translate-x-1 transition-transform">›</span>
                </button>
            </div>
        </div>
        
        {/* Background Image/Gradient */}
        <div className="absolute inset-0 z-0 opacity-80">
             {/* Fallback gradient if image fails or while loading */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
             <img 
                src={heroBanner} 
                alt="Hero Banner" 
                className="w-full h-full object-cover object-center"
            />
        </div>
      </div>

      {/* Value Proposition Strip */}
      <ValueProposition />

      {/* Brand Discovery Section */}
      <BrandDiscovery />

      {/* Best Sellers */}
      <div id="best-sellers">
        <BestSellers />
      </div>

      {/* Advertising Banner - Gaming Phones */}
      <AdvertisingBanner campaign="gaming" />

      {/* Flash Sale */}
      <FlashSale />

      {/* Advertising Banner - Ecosystem */}
      <AdvertisingBanner campaign="ecosystem" />

      {/* Accessories Showcase */}
      <AccessoriesShowcase />

      {/* Tech Blog */}
      <TechBlog />

      {/* Custom Styles */}
      <style>{`
        .fade-in-up {
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;