import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService, type Product } from '../services/product.service';
import { cartService } from '../services/cart.service';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import heroBanner from '../assets/hero_flagship_smartphone.png'; // Import user provided hero image

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const [tags, setTags] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');

  // API Base URL
  const API_BASE_URL = 'http://localhost:3000';

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    }
  };

  const fetchProducts = async (currentPage: number, search: string, tag: string) => {
    setLoading(true);
    try {
      const response = await productService.getProducts(currentPage, 12, search, tag); 
      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
    
    // Read URL params
    const searchParam = searchParams.get('search');
    const tagParam = searchParams.get('tag');
    
    if (searchParam) {
        setKeyword(searchParam);
        setSearchInput(searchParam);
    }
    
    if (tagParam) {
        setSelectedTag(tagParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts(page, keyword, selectedTag);
  }, [page, keyword, selectedTag]);

  const handleTagClick = (tagName: string) => {
      if (selectedTag === tagName) {
          setSelectedTag(''); // Toggle off
      } else {
          setSelectedTag(tagName);
          setPage(1); // Reset to first page
      }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(1); 
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    try {
      await cartService.addToCart(product.id, 1);
      toast.success(`Added ${product.title} to cart`);
    } catch (error) {
      console.error('Add to cart failed', error);
      toast.error('Failed to add to cart');
    }
  };



  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section - Apple Style */}
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
                  onClick={() => document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' })}
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



      <div id="product-section" className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filter - Minimalist */}
            <aside className="w-full lg:w-1/4 space-y-8">
                {/* Search in Sidebar for Desktop */}
                <div className="relative">
                     <input
                       type="text"
                       placeholder="Search products..."
                       className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium text-slate-900 placeholder-slate-400 text-sm"
                       value={searchInput}
                       onChange={(e) => setSearchInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                     />
                     <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Categories</h3>
                    <div className="space-y-2">
                        {['All Products', 'Smartphones', 'Accessories'].map((cat) => (
                            <div key={cat} className="flex items-center justify-between text-slate-600 hover:text-primary-600 cursor-pointer group transition-colors">
                                <span className="text-sm font-medium">{cat}</span>
                                <span className="text-xs text-slate-400 group-hover:text-primary-600">›</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Filter by</h3>
                    <div className="flex flex-wrap gap-2">
                         <button
                            onClick={() => setSelectedTag('')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                selectedTag === '' 
                                ? 'border-slate-900 bg-slate-900 text-white' 
                                : 'border-slate-200 bg-transparent text-slate-600 hover:border-slate-800 hover:text-slate-900'
                            }`}
                         >
                             All
                         </button>
                         {tags.map((tag) => (
                             <button
                                 key={tag.id}
                                 onClick={() => handleTagClick(tag.name)}
                                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                     selectedTag === tag.name
                                     ? 'border-primary-600 bg-primary-600 text-white' 
                                     : 'border-slate-200 bg-transparent text-slate-600 hover:border-slate-800 hover:text-slate-900'
                                 }`}
                             >
                                 {tag.name}
                             </button>
                         ))}
                    </div>
                </div>
                
                 {/* Price Range Placeholder */}
                 <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Price Range</h3>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-900 w-2/3"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <span>$0</span>
                        <span>$2000+</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="w-full lg:w-3/4">


                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Khám phá sản phẩm</h2>
                     <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Sort by:</span>
                        <select className="bg-transparent border-none font-medium text-slate-900 focus:ring-0 cursor-pointer">
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid - Borderless & Clean */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
                    </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group flex flex-col cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                            {/* Premium Card Image Area */}
                            <div className="relative aspect-[4/3] bg-white rounded-3xl overflow-hidden mb-6 transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
                                {product.image_url ? (
                                    <img
                                    src={getImageUrl(product.image_url)}
                                    alt={product.title}
                                    className="w-full h-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image'; }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-300 text-sm font-light">No Image</div>
                                )}
                                
                                {/* Hover Add to Cart - Minimalist Floating Button */}
                                <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
                                     <button
                                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                                        className="bg-slate-900/90 backdrop-blur-sm text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-xl hover:bg-black transition-colors flex items-center gap-2 transform active:scale-95"
                                    >
                                        <span>Add to Cart</span>
                                        <span className="w-px h-3 bg-white/20 mx-1"></span>
                                        <span>${(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toFixed(2)}</span>
                                    </button>
                                </div>

                                {/* Admin Edit - Discreet */}
                                {(user?.role === 'Admin' || user?.role === 'Staff') && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${product.id}`); }}
                                        className="absolute top-4 right-4 text-slate-300 hover:text-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-2 text-center">
                                <h3 className="font-medium text-slate-900 text-lg tracking-tight group-hover:text-primary-600 transition-colors">
                                    {product.title}
                                </h3>
                                
                                {/* Elegant Spec Badges */}
                                <div className="flex flex-wrap justify-center gap-2">
                                    {product.tags?.slice(0, 3).map((tag: any) => (
                                        <span key={tag.id} className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>

                                {/* Price - Clean Sans Serif */}
                                <div className="text-slate-900 font-semibold">
                                     ${(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}

                {/* Simplified Pagination */}
                {!loading && products.length > 0 && (
                    <div className="flex justify-center mt-16 pb-10">
                        <div className="flex items-center gap-1 border border-slate-100 bg-white rounded-full p-1 shadow-sm">
                             <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                              >
                                ←
                              </button>
                              <span className="text-xs font-medium text-slate-500 px-2">Page {page} of {totalPages}</span>
                              <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                              >
                                →
                              </button>
                        </div>
                    </div>
                )}
                
                {!loading && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No products found</h3>
                        <p className="text-slate-500 text-sm">Try changing your filters or search terms.</p>
                        <button 
                            onClick={() => {setSelectedTag(''); setSearchInput(''); setKeyword('');}}
                            className="mt-4 text-primary-600 font-medium text-sm hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;