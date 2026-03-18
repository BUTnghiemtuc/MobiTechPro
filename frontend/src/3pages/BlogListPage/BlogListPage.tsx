import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { blogService, type BlogPost } from '../../1services/blog.service';
import styles from './BlogListPage.module.css';

const BlogListPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const categories = ['Tất cả', 'So sánh', 'Hướng dẫn', 'Công nghệ'];

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const category = activeCategory === 'Tất cả' ? undefined : activeCategory;
      const result = await blogService.getBlogPosts(1, 20, category);
      setBlogPosts(result.data);
    } catch (error) {
      console.error('Failed to fetch blog posts', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className={styles.div_1}>
        <div className={styles.div_2}>
          <div className={styles.div_3} />
          <span>Loading posts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.div_4}>
      <div className={`${styles.div_5} container`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.motion_1}
        >
          <h1 className={styles.h1_1}>
            Góc công nghệ
          </h1>
          <p className={styles.p_1}>
            Tin tức, đánh giá và hướng dẫn mới nhất về smartphone và công nghệ
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className={styles.div_6}>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  category === activeCategory
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {blogPosts.length === 0 ? (
          <div className={styles.div_7}>
            <p>Chưa có bài viết nào trong danh mục này.</p>
          </div>
        ) : (
          <>
            {/* Featured Post (First Post) */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <Link
                to={`/blog/${blogPosts[0].id}`}
                className={`${styles.Link_1} group`}
              >
                {/* Image */}
                <div className={styles.div_8}>
                  {blogPosts[0].featured_image ? (
                    <img
                      src={blogPosts[0].featured_image}
                      alt={blogPosts[0].title}
                      className={styles.img_1}
                    />
                  ) : (
                    <div className={styles.div_9}>
                      <svg className={styles.svg_1} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                  <div className={styles.div_10}>
                    {blogPosts[0].category}
                  </div>
                </div>

                {/* Content */}
                <div className={styles.div_11}>
                  <div className={styles.div_12}>
                    Bài viết nổi bật
                  </div>
                  <h2 className={styles.h2_1}>
                    {blogPosts[0].title}
                  </h2>
                  <p className={styles.p_2}>
                    {blogPosts[0].excerpt}
                  </p>
                  <div className={styles.div_13}>
                    <span>{formatDate(blogPosts[0].created_at)}</span>
                    <span className={styles.span_1}>
                      <svg className={styles.svg_2} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {blogPosts[0].read_time}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>

            {/* Blog Grid (Remaining Posts) */}
            <div className={styles.div_14}>
              {blogPosts.slice(1).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    to={`/post/${post.id}`}
                    className={`${styles.Link_2} group`}
                  >
                    {/* Thumbnail */}
                    <div className={styles.div_15}>
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className={styles.img_1}
                        />
                      ) : (
                        <div className={styles.div_9}>
                          <svg className={styles.svg_3} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      {/* Category Badge */}
                      <div className={styles.div_16}>
                        {post.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className={styles.h3_1}>
                        {post.title}
                      </h3>
                      <p className={styles.p_3}>
                        {post.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className={styles.div_17}>
                        <span>{formatDate(post.created_at)}</span>
                        <span className={styles.span_1}>
                          <svg className={styles.svg_2} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {post.read_time}
                        </span>
                      </div>

                      {/* Read More Link */}
                      <div className={styles.div_18}>
                        <span>Đọc thêm</span>
                        <svg className={styles.svg_2} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={styles.motion_2}
        >
          <h3 className={styles.h3_2}>
            Muốn cập nhật tin tức mới nhất?
          </h3>
          <p className={styles.p_4}>
            Nhận thông báo về các bài viết, đánh giá và hướng dẫn mới nhất về công nghệ
          </p>
          <div className={styles.div_19}>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className={styles.input_1}
            />
            <button className={styles.button_1}>
              Đăng ký
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogListPage;
