import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, type Product } from '../services/product.service';
import { reviewService, type Review } from '../services/review.service';
import { cartService } from '../services/cart.service';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = 'http://localhost:3000';

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const productData = await productService.getProductById(Number(id));
            setProduct(productData);

            const reviewsData = await reviewService.getReviewsByProduct(id);
            setReviews(reviewsData);
        } catch (error) {
            console.error('Failed to load product details', error);
            toast.error('Product not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.info('Please login to add to cart');
            navigate('/login');
            return;
        }
        if (!product) return;

        try {
            await cartService.addToCart(product.id, 1);
            toast.success(`Added ${product.title} to cart`);
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    const getImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!product) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-10">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Product Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
                    <div className="flex flex-col md:flex-row">
                        {/* Image Gallery */}
                        <div className="md:w-1/2 p-6 bg-gray-50 flex items-center justify-center">
                            <div className="w-full max-w-md aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
                                <img 
                                    src={getImageUrl(product.image_url)} 
                                    alt={product.title} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/500?text=No+Image'; }}
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col">
                            <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex text-yellow-500 text-lg">
                                    ★★★★☆ <span className="text-gray-400 text-sm ml-2">(4.5/5)</span>
                                </div>
                                <span className="text-gray-400">|</span>
                                <span className="text-secondary-600 font-medium">In Stock</span>
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                {product.description || "Experience premium technology with this device. It offers top-tier performance, sleek design, and features that elevate your daily productivity and entertainment."}
                            </p>

                            <div className="mt-auto">
                                <div className="text-4xl font-bold text-slate-900 mb-6">
                                    ${Number(product.price).toFixed(2)}
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-primary-600 transition shadow-lg shadow-slate-900/20"
                                    >
                                        Add to Cart
                                    </button>
                                    <button className="px-6 py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                                        ❤️
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <ReviewForm productId={product.id} onReviewAdded={fetchData} />
                    </div>
                    <div className="md:col-span-2">
                         <h2 className="text-2xl font-display font-bold text-slate-800 mb-6">Customer Reviews</h2>
                        <ReviewList reviews={reviews} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
