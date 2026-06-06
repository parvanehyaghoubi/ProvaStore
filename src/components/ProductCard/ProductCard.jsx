import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, selectIsInCart } from '../../store/slices/cartSlice';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const isInCart = useSelector(selectIsInCart(product.id));
    const { state } = useAppContext();
    const isListView = state.viewMode === 'list';

    function handleCartToggle(e) {
        e.preventDefault(); // prevent Link navigation
        if (isInCart) {
            dispatch(removeFromCart(product.id));
            toast('Removed from cart', { icon: '🗑️' });
        } else {
            dispatch(addToCart(product));
            toast.success('Added to cart!');
        }
    }

    if (isListView) {
        return <ProductCardList product={product} isInCart={isInCart} onCartToggle={handleCartToggle} />;
    }

    return <ProductCardGrid product={product} isInCart={isInCart} onCartToggle={handleCartToggle} />;
}

// ─── Grid Card ─────────────────────────────────────────────────────────────────
function ProductCardGrid({ product, isInCart, onCartToggle }) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="card group flex flex-col overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Discount badge */}
                {product.discountPercentage > 0 && (
                    <span className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{Math.round(product.discountPercentage)}%
                    </span>
                )}

                {/* Category badge */}
                <span className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm capitalize">
                    {product.category}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-gray-400 ml-1">({product.rating})</span>
                </div>

                {/* Price + Cart */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                            <span className="text-xs text-gray-400 line-through ml-1">
                                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={onCartToggle}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 ${isInCart
                                ? 'bg-brand-500 text-white hover:bg-brand-600'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-600'
                            }`}
                        aria-label={isInCart ? 'Remove from cart' : 'Add to cart'}
                    >
                        {isInCart ? <CheckIcon /> : <PlusIcon />}
                    </button>
                </div>
            </div>
        </Link>
    );
}

// ─── List Card ─────────────────────────────────────────────────────────────────
function ProductCardList({ product, isInCart, onCartToggle }) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="card group flex flex-row gap-4 p-4 hover:shadow-md transition-all duration-300 animate-fade-in"
        >
            {/* Image */}
            <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 min-w-0 gap-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {product.title}
                    </h3>
                    <span className="text-xs text-gray-400 capitalize flex-shrink-0">{product.category}</span>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            ${product.price.toFixed(2)}
                        </span>
                        <StarRating rating={product.rating} small />
                    </div>

                    <button
                        onClick={onCartToggle}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 ${isInCart
                                ? 'bg-brand-500 text-white hover:bg-brand-600'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-600'
                            }`}
                    >
                        {isInCart ? 'Remove' : '+ Add'}
                    </button>
                </div>
            </div>
        </Link>
    );
}

// ─── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, small = false }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`${small ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${star <= Math.round(rating)
                            ? 'text-amber-400'
                            : 'text-gray-200 dark:text-gray-700'
                        }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function PlusIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}
