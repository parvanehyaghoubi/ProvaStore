import { useAppContext, APP_ACTIONS } from '../../context/AppContext';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, selectCartCount } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { state, dispatch } = useAppContext();
    const reduxDispatch = useDispatch();
    const cartCount = useSelector(selectCartCount);

    function handleClearCart() {
        reduxDispatch(clearCart());
        toast('Cart cleared', { icon: '🗑️' });
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Settings
            </h1>

            <div className="space-y-4">

                {/* Appearance */}
                <SettingsSection title="Appearance" icon="🎨">
                    <SettingsRow
                        label="Theme"
                        description="Switch between light and dark mode"
                    >
                        <Toggle
                            checked={state.theme === 'dark'}
                            onChange={() => dispatch({ type: APP_ACTIONS.TOGGLE_THEME })}
                            labelOn="Dark"
                            labelOff="Light"
                        />
                    </SettingsRow>

                    <SettingsRow
                        label="View Mode"
                        description="Choose how products are displayed"
                    >
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                            {['grid', 'list'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => dispatch({ type: APP_ACTIONS.SET_VIEW_MODE, payload: mode })}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${state.viewMode === mode
                                            ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </SettingsRow>
                </SettingsSection>

                {/* Product Settings */}
                <SettingsSection title="Products" icon="📦">
                    <SettingsRow
                        label="Default Sort"
                        description="How products are sorted by default"
                    >
                        <select
                            value={state.sortBy}
                            onChange={(e) => dispatch({ type: APP_ACTIONS.SET_SORT, payload: e.target.value })}
                            className="text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-xl px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
                        >
                            <option value="default">Default</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name">Name: A–Z</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </SettingsRow>
                </SettingsSection>

                {/* Cart */}
                <SettingsSection title="Cart" icon="🛒">
                    <SettingsRow
                        label="Cart Items"
                        description={`You have ${cartCount} item${cartCount !== 1 ? 's' : ''} in your cart`}
                    >
                        <button
                            onClick={handleClearCart}
                            disabled={cartCount === 0}
                            className="text-sm px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            Clear Cart
                        </button>
                    </SettingsRow>

                    <SettingsRow
                        label="Persist Cart"
                        description="Cart is saved to localStorage automatically"
                    >
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                            ✓ Active
                        </span>
                    </SettingsRow>
                </SettingsSection>

                {/* About */}
                <SettingsSection title="About" icon="ℹ️">
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 py-1">
                        <p><span className="font-medium text-gray-700 dark:text-gray-300">App:</span> Prova Store</p>
                        <p><span className="font-medium text-gray-700 dark:text-gray-300">Tech:</span> React, Redux Toolkit, React Query, Tailwind CSS</p>
                        <p><span className="font-medium text-gray-700 dark:text-gray-300">API:</span> DummyJSON Products API</p>
                        <p><span className="font-medium text-gray-700 dark:text-gray-300">Version:</span> 1.0.0</p>
                    </div>
                </SettingsSection>

            </div>
        </div>
    );
}

function SettingsSection({ title, icon, children }) {
    return (
        <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {children}
            </div>
        </div>
    );
}

function SettingsRow({ label, description, children }) {
    return (
        <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
                )}
            </div>
            <div className="flex-shrink-0">
                {children}
            </div>
        </div>
    );
}

function Toggle({ checked, onChange, labelOn, labelOff }) {
    return (
        <button
            onClick={onChange}
            className={`relative flex items-center h-8 rounded-full transition-colors duration-300 px-1 gap-1 ${checked ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
            style={{ width: '120px' }}
            role="switch"
            aria-checked={checked}
        >
            <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${checked ? 'left-[calc(100%-28px)]' : 'left-1'
                    }`}
            />
            <span className={`text-xs font-medium pl-1 transition-opacity ${checked ? 'opacity-0' : 'opacity-100 text-gray-600'}`}>
                {labelOff}
            </span>
            <span className={`text-xs font-medium ml-auto pr-1 text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}>
                {labelOn}
            </span>
        </button>
    );
}
