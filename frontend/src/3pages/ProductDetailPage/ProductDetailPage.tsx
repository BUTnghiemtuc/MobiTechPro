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
import styles from './ProductDetailPage.module.css';

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
            <div className={styles.div_1}>
                <div className={styles.div_2}>
                    <div className={styles.div_3} />
                    <span>Loading product...</span>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const avgRating = 4.5; // Will calculate from reviews
    const reviewCount = reviews.length;

    return (
        <div className={styles.div_4}>
            <div className={styles.div_5}>
                <div className={styles.div_6}>
                    {/* LEFT: Product Gallery (60%) */}
                    <div className="lg:col-span-3">
                        {/* Main Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={styles.motion_1}
                        >
                            <div className={`${styles.div_7} group`}>
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.title}
                                    className={styles.img_1}
                                />
                                {/* Zoom hint */}
                                <div className={styles.div_8}>
                                    <span className={styles.span_1}>
                                        🔍 Hover to zoom
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Thumbnail Gallery */}
                        <div className={styles.div_9}>
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
                                    <img src={img} alt={`View ${idx + 1}`} className={styles.img_2} />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Sticky Purchase Panel (40%) */}
                    <div className="lg:col-span-2">
                        <div className={styles.div_10}>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={styles.motion_2}
                            >
                                {/* Product Title & Rating */}
                                <h1 className={styles.h1_1}>
                                    {product.title}
                                </h1>
                                <div className={styles.div_11}>
                                    <div className={styles.div_12}>
                                        <div className={styles.div_13}>
                                            {'★'.repeat(Math.floor(avgRating))}
                                            {'☆'.repeat(5 - Math.floor(avgRating))}
                                        </div>
                                        <span className={styles.span_2}>
                                            {avgRating}/5
                                        </span>
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <button className={styles.button_1}>
                                        {reviewCount} đánh giá
                                    </button>
                                </div>

                                {/* Price */}
                                <div className="mb-8">
                                    <div className={styles.div_14}>
                                        ${getCurrentPrice().toFixed(2)}
                                    </div>
                                    <p className={styles.span_2}>
                                        or ${(getCurrentPrice() / 12).toFixed(2)}/month for 12 months
                                    </p>
                                </div>

                                {/* Color Selector */}
                                <div className="mb-6">
                                    <label className={styles.label_1}>
                                        Color: <span className="text-gray-900">{colors.find(c => c.value === selectedColor)?.name}</span>
                                    </label>
                                    <div className={styles.div_15}>
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
                                                    <span className={styles.span_3}>✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Storage Selector */}
                                <div className="mb-8">
                                    <label className={styles.label_1}>
                                        Storage
                                    </label>
                                    <div className={styles.div_16}>
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
                                                    <div className={styles.div_17}>+${option.price}</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Specifications Table */}
                                <div className="mb-8">
                                    <h4 className={styles.h4_1}>
                                        Thông số kỹ thuật
                                    </h4>
                                    <div className={styles.div_18}>
                                        <div className={styles.div_19}>
                                            <div className={styles.div_20}>
                                                <span className={styles.span_4}>Màn hình</span>
                                                <span className={styles.span_5}>6.7" OLED</span>
                                            </div>
                                            <div className={styles.div_20}>
                                                <span className={styles.span_4}>Camera</span>
                                                <span className={styles.span_5}>48MP</span>
                                            </div>
                                            <div className={styles.div_20}>
                                                <span className={styles.span_4}>Pin</span>
                                                <span className={styles.span_5}>4323 mAh</span>
                                            </div>
                                            <div className={styles.div_20}>
                                                <span className={styles.span_4}>Chip</span>
                                                <span className={styles.span_5}>A15 Bionic</span>
                                            </div>
                                            <div className={styles.div_20}>
                                                <span className={styles.span_4}>RAM</span>
                                                <span className={styles.span_5}>6GB</span>
                                            </div>
                                            <div className={styles.div_20}>
                                                <span className={styles.span_4}>Hệ điều hành</span>
                                                <span className={styles.span_5}>iOS 17</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="mb-6">
                                    <label className={styles.label_1}>
                                        Quantity
                                    </label>
                                    <div className={styles.div_21}>
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className={styles.el_1}
                                        >
                                            −
                                        </button>
                                        <span className={styles.span_6}>{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className={styles.el_1}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className={styles.div_22}>
                                    <button
                                        onClick={handleAddToCart}
                                        className={styles.button_2}
                                    >
                                        Add to Cart
                                    </button>
                                    <button className={styles.button_3}>
                                        <span>❤️</span> Add to Wishlist
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div className={styles.div_23}>
                                    <div className={styles.div_24}>
                                        <span className={styles.span_7}>✓</span>
                                        <span>Chính hãng VN/A - Mới 100%</span>
                                    </div>
                                    <div className={styles.div_24}>
                                        <span className={styles.span_7}>✓</span>
                                        <span>Bảo hành 12 tháng tại Apple Store</span>
                                    </div>
                                    <div className={styles.div_24}>
                                        <span className={styles.span_7}>✓</span>
                                        <span>Đổi trả miễn phí trong 30 ngày</span>
                                    </div>
                                    <div className={styles.div_24}>
                                        <span className={styles.span_7}>✓</span>
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
                    className={styles.motion_3}
                >
                    <h2 className={styles.h2_1}>Về sản phẩm</h2>
                    <p className={styles.p_1}>
                        {product.description || "Experience premium technology with this device. It offers top-tier performance, sleek design, and features that elevate your daily productivity and entertainment."}
                    </p>
                </motion.div>

                {/* Reviews Section */}
                <div className="mt-16">
                    <h2 className={styles.h2_2}>Đánh giá từ khách hàng</h2>
                    <div className={styles.div_25}>
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
