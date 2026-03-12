import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService, type BlogPost } from '../../1services/blog.service';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-lg"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading post...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
            {isEditing ? '✏️ Edit Post' : '✨ Create New Post'}
          </h1>
          <p className="text-slate-400 text-lg">
            {isEditing ? 'Update your blog post content' : 'Write and publish a new blog post'}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <label className="block text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-2xl font-bold placeholder-slate-500 transition-all"
              placeholder="Enter an amazing post title..."
            />
          </motion.div>

          {/* URL Slug */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <label className="block text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
              URL Slug
              <span className="text-slate-400 text-xs ml-2 normal-case">(auto-generated if empty)</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug || ''}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-300 placeholder-slate-600 font-mono transition-all"
              placeholder="post-url-slug"
            />
          </motion.div>

          {/* Category and Read Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <label className="block text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white cursor-pointer transition-all"
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
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <label className="block text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
                Read Time
                <span className="text-slate-400 text-xs ml-2 normal-case">(auto-calculated)</span>
              </label>
              <input
                type="text"
                name="read_time"
                value={formData.read_time || ''}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-300 placeholder-slate-600 transition-all"
                placeholder="5 phút đọc"
              />
            </motion.div>
          </div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <label className="block text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
              Featured Image URL
            </label>
            <input
              type="url"
              name="featured_image"
              value={formData.featured_image}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-300 placeholder-slate-600 transition-all"
              placeholder="https://example.com/image.jpg"
            />
            {formData.featured_image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 rounded-xl overflow-hidden border-2 border-blue-500/30 shadow-xl"
              >
                <img
                  src={formData.featured_image}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Excerpt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <label className="block text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              maxLength={300}
              className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-300 placeholder-slate-600 leading-relaxed transition-all"
              placeholder="Write a compelling short description..."
            />
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
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
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <label className="block text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
              Content * 
              <span className="text-slate-400 text-xs ml-2 normal-case">(HTML supported)</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={20}
              className="w-full px-5 py-4 bg-slate-950/80 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm text-slate-200 placeholder-slate-600 leading-relaxed transition-all"
              placeholder="<p>Write your amazing content here... HTML is supported.</p>"
            />
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="font-medium text-blue-400">{formData.content?.split(/\s+/).length || 0}</span>
                <span>words</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-medium text-purple-400">{formData.content?.length || 0}</span>
                <span>characters</span>
              </span>
            </div>
          </motion.div>

          {/* Published Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 shadow-2xl"
          >
            <label className="flex items-center gap-4 cursor-pointer group">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-6 h-6 text-green-500 border-green-400 rounded focus:ring-2 focus:ring-green-500 cursor-pointer transition-all"
              />
              <div>
                <span className="text-base font-semibold text-green-300 group-hover:text-green-200 transition-colors">
                  Publish this post
                </span>
                <p className="text-xs text-slate-400 mt-1">
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
            className="flex items-center justify-end gap-4 pt-8"
          >
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className="px-8 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 transition-all hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
