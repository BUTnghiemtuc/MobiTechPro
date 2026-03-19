import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// Nhớ kiểm tra lại đường dẫn import này anh nhé
import { blogService, type BlogPost } from '../../1services/blog.service';
import styles from './TechBlog.module.css';

const TechBlog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Kéo đường dẫn từ file env để nối ảnh gốc
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const result = await blogService.getBlogPosts(1, 3); // Lấy 3 bài mới nhất
      setBlogPosts(result.data);
    } catch (error) {
      console.error('Lỗi khi tải bài viết blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Nếu đang tải hoặc không có bài viết nào thì ẩn nguyên cụm này đi cho đỡ trống
  if (loading || blogPosts.length === 0) {
    return null; 
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* --- Header Khối --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.headerBox}
        >
          <div className={styles.headerFlex}>
            <div>
              <h2 className={styles.title}>
                Góc công nghệ
              </h2>
              <p className={styles.subtitle}>
                Tin tức, đánh giá và hướng dẫn mới nhất
              </p>
            </div>
            
            {/* Nút xem tất cả trên Desktop */}
            <Link to="/blog" className={styles.viewAllLink}>
              <span>Xem tất cả</span>
              <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* --- Lưới Bài Viết --- */}
        <div className={styles.grid}>
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.id}`} className={styles.cardLink}>
                
                {/* Ảnh Thumbnail */}
                <div className={styles.thumbWrapper}>
                  {post.featured_image ? (
                    <img
                      src={getImageUrl(post.featured_image)}
                      alt={post.title}
                      className={styles.thumbImg}
                    />
                  ) : (
                    <div className={styles.placeholderThumb}>
                      <svg className={styles.placeholderIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                  {/* Tag Phân loại */}
                  <div className={styles.categoryBadge}>
                    {post.category}
                  </div>
                </div>

                {/* Nội Dung Text */}
                <div className={styles.contentBox}>
                  <h3 className={styles.postTitle}>
                    {post.title}
                  </h3>
                  <p className={styles.postExcerpt}>
                    {post.excerpt}
                  </p>

                  {/* Thông tin phụ */}
                  <div className={styles.metaRow}>
                    <span>{formatDate(post.created_at)}</span>
                    <span className={styles.metaItem}>
                      <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.read_time || '5 phút'}
                    </span>
                  </div>

                  {/* Nút Đọc Thêm */}
                  <div className={styles.readMore}>
                    <span>Đọc thêm</span>
                    <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Nút xem tất cả trên Mobile */}
        <div className={styles.mobileViewAll}>
          <Link to="/blog" className={styles.viewAllLink} style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <span>Xem tất cả bài viết</span>
            <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TechBlog;