import {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService, type BlogPost } from '../../1services/blog.service';
import { toast } from 'react-toastify';
import styles from './BlogManagement.module.css';

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [published, setPublished] = useState<boolean | undefined>(undefined);
  const [search, setSearch] = useState('');

  const categories = ['all', 'So sánh', 'Hướng dẫn', 'Công nghệ'];

  useEffect(() => {
    fetchPosts();
  }, [category, published]);

  const fetchPosts = async () => {
    try {
     setLoading(true);
      const result = await blogService.getAllBlogPosts(1, 50, category, published, search);
      setPosts(result.data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await blogService.deleteBlogPost(id);
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post', error);
      toast.error('Failed to delete post');
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      await blogService.togglePublish(id);
      toast.success('Post status updated');
      fetchPosts();
    } catch (error) {
      console.error('Failed to toggle publish', error);
      toast.error('Failed to update post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className={styles.div_1}>
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className={styles.div_2}>
        <div>
          <h1 className={styles.h1_1}>Blog Posts</h1>
          <p className="text-slate-600">Manage your blog content</p>
        </div>
        <Link
          to="/admin/blog/new"
          className={styles.Link_1}
        >
          <svg className={styles.svg_1} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Post</span>
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.div_3}>
        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.el_1}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={published === undefined ? 'all' : published ? 'published' : 'draft'}
          onChange={(e) => {
            const val = e.target.value;
            setPublished(val === 'all' ? undefined : val === 'published');
          }}
          className={styles.el_1}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        {/* Search */}
        <div className={styles.div_4}>
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPosts()}
            className={styles.el_2}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.div_5}>
        <table className="w-full">
          <thead className={styles.thead_1}>
            <tr>
              <th className={styles.th_1}>Title</th>
              <th className={styles.th_1}>Category</th>
              <th className={styles.th_1}>Author</th>
              <th className={styles.th_1}>Status</th>
              <th className={styles.th_1}>Created</th>
              <th className={styles.th_2}>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tbody_1}>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.td_1}>
                  No blog posts found. Create your first post!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className={styles.tr_1}>
                  <td className={styles.td_2}>
                    <div className={styles.div_6}>{post.title}</div>
                    <div className={styles.div_7}>{post.read_time}</div>
                  </td>
                  <td className={styles.td_2}>
                    <span className={styles.span_1}>
                      {post.category}
                    </span>
                  </td>
                  <td className={styles.td_3}>
                    {post.author?.username || 'Unknown'}
                  </td>
                  <td className={styles.td_2}>
                    <button
                      onClick={() => handleTogglePublish(post.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        post.published
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className={styles.td_3}>
                    {formatDate(post.created_at)}
                  </td>
                  <td className={styles.td_4}>
                    <div className={styles.div_8}>
                      <Link
                        to={`/admin/blog/${post.id}/edit`}
                        className={styles.Link_2}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className={styles.el_3}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogManagement;
