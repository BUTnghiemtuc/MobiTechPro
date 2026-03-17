import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService, type Product } from '../../1services/product.service';
import { reviewService, type Review } from '../../1services/review.service';
import { cartService } from '../../1services/cart.service';
import { useAuth } from '../../2context/AuthContext';
import { toast } from 'react-toastify';
import ReviewForm from '../../4components/reviews/ReviewForm';
import ReviewList from '../../4components/reviews/ReviewList';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const API_BASE_URL = 'http://localhost:3000';

    // Mock data for variants (will be replaced with API data)
    const colors = [
        { name: 'Midnight', value: 'midnight', hex: '#1d1d1f' },
        { name: 'Starlight', value: 'starlight', hex: '#f5f5f0' },
        { name: 'Purple', value: 'purple', hex: '#b794f6' },
        { name: 'Blue', value: 'blue', hex: '#3b82f6' },
    ];

    const storageOptions = [
        { capacity: '128GB', price: 0 },
        { capacity: '256GB', price: 100 },
        { capacity: '512GB', price: 200 },
        { capacity: '1TB', price: 400 },
    ];

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const productData = await productService.getProductById(Number(id));
            setProduct(productData);
            setSelectedColor(colors[0].value);
            setSelectedStorage(storageOptions[0].capacity);

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
            await cartService.addToCart(product.id, quantity);
            toast.success(`Added ${product.title} to cart`);
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    const getImageUrl = (url?: string) => {
        if (!url) return 'https://via.placeholder.com/600?text=No+Image';
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    const getCurrentPrice = () => {
        if (!product) return 0;
        const basePrice = Number(product.price);
        const selectedStorageOption = storageOptions.find(s => s.capacity === selectedStorage);
        return basePrice + (selectedStorageOption?.price || 0);
    };

    // Use product images from API, fallback to single image if not available
    const productImages = product?.images && product.images.length > 0
        ? product.images.map(url => getImageUrl(url))
        : [getImageUrl(product?.image_url)];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
                <div className="text-gray-900 text-lg flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading product...</span>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const avgRating = 4.5; // Will calculate from reviews
    const reviewCount = reviews.length;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* LEFT: Product Gallery (60%) */}
                    <div className="lg:col-span-3">
                        {/* Main Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg mb-6"
                        >
                            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative group">
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Zoom hint */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="text-gray-900 text-sm bg-white/90 px-4 py-2 rounded-full shadow-lg">
                                        🔍 Hover to zoom
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-4">
                            {productImages.map((img, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                        selectedImage === idx
                                            ? 'border-blue-500 shadow-lg shadow-blue-500/30'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Sticky Purchase Panel (40%) */}
                    <div className="lg:col-span-2">
                        <div className="lg:sticky lg:top-24">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl"
                            >
                                {/* Product Title & Rating */}
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                    {product.title}
                                </h1>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-yellow-500 text-lg">
                                            {'★'.repeat(Math.floor(avgRating))}
                                            {'☆'.repeat(5 - Math.floor(avgRating))}
                                        </div>
                                        <span className="text-gray-600 text-sm">
                                            {avgRating}/5
                                        </span>
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <button className="text-blue-600 hover:text-blue-500 text-sm transition-colors">
                                        {reviewCount} đánh giá
                                    </button>
                                </div>

                                {/* Price */}
                                <div className="mb-8">
                                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                        ${getCurrentPrice().toFixed(2)}
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        or ${(getCurrentPrice() / 12).toFixed(2)}/month for 12 months
                                    </p>
                                </div>

                                {/* Color Selector */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                        Color: <span className="text-gray-900">{colors.find(c => c.value === selectedColor)?.name}</span>
                                    </label>
                                    <div className="flex gap-3">
                                        {colors.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => setSelectedColor(color.value)}
                                                className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 ${
                                                    selectedColor === color.value
                                                        ? 'border-blue-500 shadow-lg shadow-blue-500/30'
                                                        : 'border-gray-300'
                                                }`}
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            >
                                                {selectedColor === color.value && (
                                                    <span className="text-white text-xl">✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Storage Selector */}
                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                        Storage
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {storageOptions.map((option) => (
                                            <button
                                                key={option.capacity}
                                                onClick={() => setSelectedStorage(option.capacity)}
                                                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                                                    selectedStorage === option.capacity
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {option.capacity}
                                                {option.price > 0 && (
                                                    <div className="text-xs mt-1">+${option.price}</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Specifications Table */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                        Thông số kỹ thuật
                                    </h4>
                                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                        <div className="divide-y divide-gray-200">
                                            <div className="flex py-3 px-4">
                                                <span className="w-1/2 text-sm text-gray-600">Màn hình</span>
                                                <span className="w-1/2 text-sm font-medium text-gray-900">6.7" OLED</span>
                                            </div>
                                            <div className="flex py-3 px-4">
                                                <span className="w-1/2 text-sm text-gray-600">Camera</span>
                                                <span className="w-1/2 text-sm font-medium text-gray-900">48MP</span>
                                            </div>
                                            <div className="flex py-3 px-4">
                                                <span className="w-1/2 text-sm text-gray-600">Pin</span>
                                                <span className="w-1/2 text-sm font-medium text-gray-900">4323 mAh</span>
                                            </div>
                                            <div className="flex py-3 px-4">
                                                <span className="w-1/2 text-sm text-gray-600">Chip</span>
                                                <span className="w-1/2 text-sm font-medium text-gray-900">A15 Bionic</span>
                                            </div>
                                            <div className="flex py-3 px-4">
                                                <span className="w-1/2 text-sm text-gray-600">RAM</span>
                                                <span className="w-1/2 text-sm font-medium text-gray-900">6GB</span>
                                            </div>
                                            <div className="flex py-3 px-4">
                                                <span className="w-1/2 text-sm text-gray-600">Hệ điều hành</span>
                                                <span className="w-1/2 text-sm font-medium text-gray-900">iOS 17</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="text-gray-900 font-semibold text-lg w-12 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-3 mb-8">
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
                                    >
                                        Add to Cart
                                    </button>
                                    <button className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                                        <span>❤️</span> Add to Wishlist
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div className="space-y-3 border-t border-gray-200 pt-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <span className="text-green-600 text-xl">✓</span>
                                        <span>Chính hãng VN/A - Mới 100%</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <span className="text-green-600 text-xl">✓</span>
                                        <span>Bảo hành 12 tháng tại Apple Store</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <span className="text-green-600 text-xl">✓</span>
                                        <span>Đổi trả miễn phí trong 30 ngày</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <span className="text-green-600 text-xl">✓</span>
                                        <span>Giao hàng miễn phí toàn quốc</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Product Description & Specs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 bg-white rounded-3xl p-8 border border-gray-200 shadow-lg"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Về sản phẩm</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {product.description || "Experience premium technology with this device. It offers top-tier performance, sleek design, and features that elevate your daily productivity and entertainment."}
                    </p>
                </motion.div>

                {/* Reviews Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Đánh giá từ khách hàng</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <ReviewForm productId={product.id} onReviewAdded={fetchData} />
                        </div>
                        <div className="md:col-span-2">
                            <ReviewList reviews={reviews} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
