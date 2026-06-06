import { useAppContext, APP_ACTIONS } from '../../context/AppContext';
import { useCategories } from '../../hooks/useProducts';

export default function ProductToolbar({ totalProducts }) {
    const { state, dispatch } = useAppContext();
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();

    return (
        <div className="space-y-4 mb-8">
            {/* Search + View toggle */}
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={state.searchQuery}
                        onChange={(e) => dispatch({ type: APP_ACTIONS.SET_SEARCH, payload: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-600 transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Sort */}
                <select
                    value={state.sortBy}
                    onChange={(e) => dispatch({ type: APP_ACTIONS.SET_SORT, payload: e.target.value })}
                    className="px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all text-gray-700 dark:text-gray-300"
                >
                    <option value="default">Sort: Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A–Z</option>
                    <option value="rating">Rating</option>
                </select>

                {/* View mode toggle */}
                <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
                    <button
                        onClick={() => dispatch({ type: APP_ACTIONS.SET_VIEW_MODE, payload: 'grid' })}
                        className={`p-1.5 rounded-lg transition-all ${state.viewMode === 'grid'
                                ? 'bg-brand-500 text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        aria-label="Grid view"
                    >
                        <GridIcon />
                    </button>
                    <button
                        onClick={() => dispatch({ type: APP_ACTIONS.SET_VIEW_MODE, payload: 'list' })}
                        className={`p-1.5 rounded-lg transition-all ${state.viewMode === 'list'
                                ? 'bg-brand-500 text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        aria-label="List view"
                    >
                        <ListIcon />
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button
                    onClick={() => dispatch({ type: APP_ACTIONS.SET_CATEGORY, payload: 'all' })}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${state.selectedCategory === 'all'
                            ? 'bg-brand-500 text-white shadow-sm'
                            : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-300'
                        }`}
                >
                    All
                </button>

                {!categoriesLoading &&
                    categories.slice(0, 16).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => dispatch({ type: APP_ACTIONS.SET_CATEGORY, payload: cat })}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-200 ${state.selectedCategory === cat
                                    ? 'bg-brand-500 text-white shadow-sm'
                                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-300'
                                }`}
                        >
                            {cat.replace(/-/g, ' ')}
                        </button>
                    ))}
            </div>

            {/* Result count */}
            {totalProducts !== undefined && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium text-gray-900 dark:text-white">{totalProducts}</span> products
                </p>
            )}
        </div>
    );
}

function SearchIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function GridIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}

function ListIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}
