import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useProduct, useSubmitReview } from '../../hooks/useProducts';
import { addToCart, removeFromCart, selectIsInCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function ProductDetails() {
    const { id } = useParams();
    const { data: product, isLoading, isError } = useProduct(Number(id));
    const dispatch = useDispatch();
    const isInCart = useSelector(selectIsInCart(Number(id)));
    const [selectedImage, setSelectedImage] = useState(0);
    const [review, setReview] = useState({ rating: 5, comment: '' });
    const submitReview = useSubmitReview();

    function handleCartToggle() {
        if (isInCart) {
            dispatch(removeFromCart(product.id));
            toast('Removed from cart', { icon: '🗑️' });
        } else {
            dispatch(addToCart(product));
            toast.success('Added to cart!');
        }
    }

    function handleReviewSubmit(e) {
        e.preventDefault();
        if (!review.comment.trim()) return;

        submitReview.mutate(
            { productId: product.id, review },
            {
                onSuccess: () => {
                    toast.success('Review submitted!');
                    setReview({ rating: 5, comment: '' });
                },
                onError: () => toast.error('Failed to submit review'),
            }
        );
    }

    if (isLoading) return <ProductDetailsSkeleton />;

    if (isError) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <p className="text-gray-500 dark:text-gray-400">Product not found.</p>
                <Link to="/" className="btn-primary mt-4 inline-block">Back to Shop</Link>
            </div>
        );
    }

    const images = product.images?.length > 0 ? product.images : [product.thumbnail];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
                <Link to="/" className="hover:text-brand-500 transition-colors">Shop</Link>
                <span>/</span>
                <span className="capitalize">{product.category}</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white line-clamp-1">{product.title}</span>
            </nav>

            {/* Main content */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Images */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        <img
                            src={images[selectedImage]}
                            alt={product.title}
                            className="w-full h-full object-cover transition-all duration-300"
                        />
                    </div>

                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === idx
                                            ? 'border-brand-500 shadow-md scale-95'
                                            : 'border-transparent hover:border-brand-200'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-6">
                    <div>
                        <span className="text-sm font-medium text-brand-500 capitalize">{product.category}</span>
                        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {product.title}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{product.brand}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                        <StarRatingDisplay rating={product.rating} />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {product.rating} / 5 · {product.stock} in stock
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className="font-display text-4xl font-bold text-gray-900 dark:text-white">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                            <>
                                <span className="text-xl text-gray-400 line-through">
                                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                                </span>
                                <span className="bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-semibold px-2 py-0.5 rounded-lg">
                                    -{Math.round(product.discountPercentage)}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Tags */}
                    {product.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag) => (
                                <span key={tag} className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleCartToggle}
                            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 ${isInCart
                                    ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-200 dark:shadow-brand-900'
                                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100'
                                }`}
                        >
                            {isInCart ? '✓ In Cart — Remove' : 'Add to Cart'}
                        </button>
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        {[
                            { label: 'SKU', value: product.sku || 'N/A' },
                            { label: 'Weight', value: product.weight ? `${product.weight}g` : 'N/A' },
                            { label: 'Warranty', value: product.warrantyInformation || 'N/A' },
                            { label: 'Shipping', value: product.shippingInformation || 'Standard' },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3">
                                <span className="text-xs text-gray-400 block">{label}</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews section */}
            <div className="grid lg:grid-cols-2 gap-12">
                {/* Existing reviews */}
                <div>
                    <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Reviews
                    </h2>
                    {product.reviews?.length > 0 ? (
                        <div className="space-y-4">
                            {product.reviews.map((r, idx) => (
                                <div key={idx} className="card p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                                            {r.reviewerName}
                                        </span>
                                        <StarRatingDisplay rating={r.rating} small />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(r.date).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
                    )}
                </div>

                {/* Write a review (mutation) */}
                <div>
                    <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Write a Review
                    </h2>
                    <form onSubmit={handleReviewSubmit} className="card p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Rating
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReview((r) => ({ ...r, rating: star }))}
                                        className={`text-2xl transition-transform hover:scale-110 ${star <= review.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Comment
                            </label>
                            <textarea
                                value={review.comment}
                                onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))}
                                placeholder="Share your experience..."
                                rows={4}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitReview.isPending || !review.comment.trim()}
                            className="btn-primary w-full py-2.5 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function StarRatingDisplay({ rating, small = false }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`${small ? 'text-sm' : 'text-lg'} ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

function ProductDetailsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="aspect-square skeleton rounded-2xl" />
                <div className="space-y-4">
                    <div className="h-6 skeleton rounded-lg w-1/4" />
                    <div className="h-10 skeleton rounded-lg w-3/4" />
                    <div className="h-4 skeleton rounded-lg w-1/2" />
                    <div className="h-16 skeleton rounded-lg" />
                    <div className="h-12 skeleton rounded-xl" />
                </div>
            </div>
        </div>
    );
}
