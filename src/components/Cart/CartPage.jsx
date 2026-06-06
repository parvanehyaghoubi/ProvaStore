import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    selectCartItems,
    selectCartTotal,
    selectCartCount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
} from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function CartPage() {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const count = useSelector(selectCartCount);

    if (items.length === 0) {
        return <EmptyCart />;
    }

    function handleClear() {
        dispatch(clearCart());
        toast('Cart cleared', { icon: '🗑️' });
    }

    function handleCheckout() {
        dispatch(clearCart());
        toast.success('Order placed! 🎉 Thank you for shopping!', { duration: 4000 });
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                        Your Cart
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {count} {count === 1 ? 'item' : 'items'}
                    </p>
                </div>
                <button
                    onClick={handleClear}
                    className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                >
                    <TrashIcon className="w-4 h-4" />
                    Clear all
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Items list */}
                <div className="lg:col-span-2 space-y-3">
                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onIncrease={() => dispatch(increaseQuantity(item.id))}
                            onDecrease={() => dispatch(decreaseQuantity(item.id))}
                            onRemove={() => {
                                dispatch(removeFromCart(item.id));
                                toast('Item removed', { icon: '🗑️' });
                            }}
                        />
                    ))}
                </div>

                {/* Order summary */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-24 space-y-4">
                        <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                            Order Summary
                        </h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal ({count} items)</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Shipping</span>
                                <span className="text-green-600 dark:text-green-400">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Tax (10%)</span>
                                <span>${(total * 0.1).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                            <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                                <span>Total</span>
                                <span>${(total * 1.1).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="btn-primary w-full py-3 text-center font-semibold text-sm"
                        >
                            Checkout →
                        </button>

                        <Link
                            to="/"
                            className="block text-center text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Cart Item ─────────────────────────────────────────────────────────────────
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
    return (
        <div className="card p-4 flex gap-4 animate-slide-up hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover bg-gray-50 dark:bg-gray-800"
                />
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                    <Link
                        to={`/product/${item.id}`}
                        className="font-medium text-sm text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 line-clamp-2 transition-colors"
                    >
                        {item.title}
                    </Link>
                    <button
                        onClick={onRemove}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                        aria-label="Remove item"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>

                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.category}</span>

                <div className="flex items-center justify-between mt-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                        <button
                            onClick={onDecrease}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900 hover:text-brand-600 transition-all text-sm font-medium shadow-sm"
                        >
                            −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-gray-900 dark:text-white">
                            {item.quantity}
                        </span>
                        <button
                            onClick={onIncrease}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900 hover:text-brand-600 transition-all text-sm font-medium shadow-sm"
                        >
                            +
                        </button>
                    </div>

                    <span className="font-semibold text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── Empty Cart ────────────────────────────────────────────────────────────────
function EmptyCart() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-24 h-24 bg-brand-50 dark:bg-brand-950/30 rounded-3xl flex items-center justify-center mb-6">
                    <span className="text-5xl">🛒</span>
                </div>
                <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Your cart is empty
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                    Looks like you haven't added anything yet. Start shopping to fill it up!
                </p>
                <Link to="/" className="btn-primary px-8 py-3 font-semibold">
                    Browse Products
                </Link>
            </div>
        </div>
    );
}

function TrashIcon({ className = 'w-5 h-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}
