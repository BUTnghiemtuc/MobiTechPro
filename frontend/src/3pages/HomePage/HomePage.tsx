import heroBanner from '../../assets/hero_flagship_smartphone.png';
import ValueProposition from '../../4components/ValueProposition/ValueProposition';
import BrandDiscovery from '../../4components/BrandDiscovery/BrandDiscovery';
import BestSellers from '../../4components/BestSellers/BestSellers';
import FlashSale from '../../4components/FlashSale/FlashSale';
import AdvertisingBanner from '../../4components/AdvertisingBanner/AdvertisingBanner';
import AccessoriesShowcase from '../../4components/AccessoriesShowcase/AccessoriesShowcase';
import TechBlog from '../../4components/TechBlog/TechBlog';
import './HomePage.module.css';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.div_1}>
      {/* Hero Section */}
      <div className={styles.div_2}>
        <div className={styles.div_3}>
            <h2 className={styles.h2_1}>New Arrival</h2>
            <h1 className={styles.h1_1}>
                iPhone 17 Pro Max
            </h1>
            <p className={styles.p_1}>
                Titanium. So strong. So light. So Pro.
            </p>
            <div className={styles.div_4}>
                <button 
                  onClick={() => document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' })}
                  className={styles.el_1}
                >
                    Buy Now
                </button>
                <button 
                  className={`${styles.button_1} group`}
                >
                    Learn more <span className={styles.span_1}>›</span>
                </button>
            </div>
        </div>
        
        {/* Background Image/Gradient */}
        <div className={styles.div_5}>
             {/* Fallback gradient if image fails or while loading */}
             <div className={styles.div_6} />
             <img 
                src={heroBanner} 
                alt="Hero Banner" 
                className={styles.img_1}
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

    </div>
  );
};

export default HomePage;