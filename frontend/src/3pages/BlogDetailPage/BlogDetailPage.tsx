import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { blogService, type BlogPost } from '../../1services/blog.service';
import './BlogDetailPage.module.css';
import styles from './BlogDetailPage.module.css';

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await blogService.getBlogPost(parseInt(id!));
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch blog post', error);
      setPost(null);
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
          <span>Loading post...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.div_1}>
        <div className="text-center">
          <h1 className={styles.h1_1}>Không tìm thấy bài viết</h1>
          <Link to="/blog" className={styles.Link_1}>
            ← Quay lại danh sách blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.div_4}>
      <article className={styles.article_1}>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className={styles.div_5}>
            <Link to="/" className={styles.Link_2}>Trang chủ</Link>
            <span>/</span>
            <Link to="/blog" className={styles.Link_2}>Blog</Link>
            <span>/</span>
            <span className="text-slate-500">{post.category}</span>
          </div>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className={styles.div_6}>
            {post.category}
          </div>
          <h1 className={styles.h1_2}>
            {post.title}
          </h1>
          <div className={styles.div_7}>
            <span>{formatDate(post.created_at)}</span>
            <span className={styles.span_1}>
              <svg className={styles.svg_1} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.read_time}
            </span>
            {post.author && (
              <span className={styles.span_1}>
                <svg className={styles.svg_1} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author.username}
              </span>
            )}
          </div>
        </motion.div>

        {/* Featured Image */}
        {post.featured_image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={styles.motion_1}
          >
            <img
              src={post.featured_image}
              alt={post.title}
              className={styles.img_1}
            />
          </motion.div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <p className={styles.p_1}>
              {post.excerpt}
            </p>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={styles.motion_2}
        >
          <div 
            className={styles.div_8}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>

        {/* Navigation */}
        <div className={styles.div_9}>
          <button
            onClick={() => navigate('/blog')}
            className={styles.el_1}
          >
            <svg className={styles.svg_2} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Quay lại danh sách blog</span>
          </button>
        </div>
      </article>

    </div>
  );
};

export default BlogDetailPage;
