import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className={styles.layoutWrapper}>
      <Header />
      
      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
           <motion.div
             key={location.pathname}
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -15 }}
             transition={{ duration: 0.3, ease: "easeOut" }}
             className={styles.pageContainer}
           >
             <Outlet />
           </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;