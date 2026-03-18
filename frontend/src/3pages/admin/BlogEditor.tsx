import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService, type BlogPost } from '../../1services/blog.service';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import styles from './BlogEditor.module.css';

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'Công nghệ',
    featured_image: '',
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  const categories = ['So sánh', 'Hướng dẫn', 'Công nghệ'];

  useEffect(() => {
    if (isEditing && id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setFetching(true);
      const post = await blogService.getBlogPost(parseInt(id!));
      setFormData(post);
    } catch (error) {
      console.error('Failed to fetch post', error);
      toast.error('Failed to load post');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await blogService.updateBlogPost(parseInt(id!), formData);
        toast.success('Post updated successfully');
      } else {
        await blogService.createBlogPost(formData);
        toast.success('Post created successfully');
      }
      navigate('/admin/blog');
    } catch (error) {
      console.error('Failed to save post', error);
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.div_1}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.motion_1}
        >
          <div className={styles.div_2}>
            <div className={styles.div_3} />
            <span>Loading post...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.div_4}>
      <div className={styles.div_5}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={styles.h1_1}>
            {isEditing ? '✏️ Edit Post' : '✨ Create New Post'}
          </h1>
          <p className={styles.p_1}>
            {isEditing ? 'Update your blog post content' : 'Write and publish a new blog post'}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.motion_2}
          >
            <label className={styles.label_1}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input_1}
              placeholder="Enter an amazing post title..."
            />
          </motion.div>

          {/* URL Slug */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={styles.motion_2}
          >
            <label className={styles.label_1}>
              URL Slug
              <span className={styles.span_1}>(auto-generated if empty)</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug || ''}
              onChange={handleChange}
              className={styles.input_2}
              placeholder="post-url-slug"
            />
          </motion.div>

          {/* Category and Read Time Grid */}
          <div className={styles.div_6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.motion_2}
            >
              <label className={styles.label_1}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={styles.select_1}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.motion_2}
            >
              <label className={styles.label_1}>
                Read Time
                <span className={styles.span_1}>(auto-calculated)</span>
              </label>
              <input
                type="text"
                name="read_time"
                value={formData.read_time || ''}
                onChange={handleChange}
                className={styles.input_3}
                placeholder="5 phút đọc"
              />
            </motion.div>
          </div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={styles.motion_2}
          >
            <label className={styles.label_1}>
              Featured Image URL
            </label>
            <input
              type="url"
              name="featured_image"
              value={formData.featured_image}
              onChange={handleChange}
              className={styles.input_3}
              placeholder="https://example.com/image.jpg"
            />
            {formData.featured_image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.motion_3}
              >
                <img
                  src={formData.featured_image}
                  alt="Preview"
                  className={styles.img_1}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Excerpt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.motion_2}
          >
            <label className={styles.label_1}>
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              maxLength={300}
              className={styles.textarea_1}
              placeholder="Write a compelling short description..."
            />
            <div className={styles.div_7}>
              <span className={`font-medium ${(formData.excerpt?.length || 0) > 280 ? 'text-orange-400' : 'text-blue-400'}`}>
                {formData.excerpt?.length || 0}/300
              </span>
              <span>characters</span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={styles.motion_2}
          >
            <label className={styles.label_1}>
              Content * 
              <span className={styles.span_1}>(HTML supported)</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={20}
              className={styles.textarea_2}
              placeholder="<p>Write your amazing content here... HTML is supported.</p>"
            />
            <div className={styles.div_8}>
              <span className={styles.span_2}>
                <span className={styles.span_3}>{formData.content?.split(/\s+/).length || 0}</span>
                <span>words</span>
              </span>
              <span className={styles.span_2}>
                <span className={styles.span_4}>{formData.content?.length || 0}</span>
                <span>characters</span>
              </span>
            </div>
          </motion.div>

          {/* Published Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={styles.motion_4}
          >
            <label className={`${styles.label_2} group`}>
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className={styles.input_4}
              />
              <div>
                <span className={styles.span_5}>
                  Publish this post
                </span>
                <p className={styles.p_2}>
                  {formData.published ? '🟢 Post will be visible to everyone' : '🟡 Post will be saved as draft'}
                </p>
              </div>
            </label>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className={styles.motion_5}
          >
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className={styles.el_1}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.button_1}
            >
              {loading ? (
                <span className={styles.span_2}>
                  <div className={styles.div_9} />
                  Saving...
                </span>
              ) : (
                isEditing ? '💾 Update Post' : '🚀 Create Post'
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;
