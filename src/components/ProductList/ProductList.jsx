import { useState, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useAppContext } from '../../context/AppContext';
import ProductCard from '../ProductCard/ProductCard';
import ProductSkeleton from '../UI/ProductSkeleton';
import ProductToolbar from './ProductToolbar';

const ITEMS_PER_PAGE = 12;

export default function ProductList() {
    const [page, setPage] = useState(1);
    const { state } = useAppContext();

    const { data, isLoading, isError, error, isFetching } = useProducts({
        page,
        limit: ITEMS_PER_PAGE,
        category: state.selectedCategory,
        search: state.searchQuery,
    });

    // Client-side sort on top of server results
    const sortedProducts = useMemo(() => {
        if (!data?.products) return [];
        const products = [...data.products];
        switch (state.sortBy) {
            case 'price-asc': return products.sort((a, b) => a.price - b.price);
            case 'price-desc': return products.sort((a, b) => b.price - a.price);
            case 'name': return products.sort((a, b) => a.title.localeCompare(b.title));
            case 'rating': return products.sort((a, b) => b.rating - a.rating);
            default: return products;
        }
    }, [data?.products, state.sortBy]);

    const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

    // Reset page when filters change
    const handleFilterChange = () => setPage(1);

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-3xl">⚠️</span>
                </div>
                <h2 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2">
                    Something went wrong
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                    {error?.message || 'Failed to load products. Please try again.'}
                </p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <ProductToolbar
                totalProducts={data?.total}
                onFilterChange={handleFilterChange}
            />

            {/* Loading overlay for page transitions */}
            <div className={`transition-opacity duration-200 ${isFetching && !isLoading ? 'opacity-60' : 'opacity-100'}`}>
                <div
                    className={`grid gap-4 ${state.viewMode === 'grid'
                            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                            : 'grid-cols-1'
                        }`}
                >
                    {isLoading
                        ? <ProductSkeleton count={ITEMS_PER_PAGE} />
                        : sortedProducts.length > 0
                            ? sortedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                            : <EmptyState />
                    }
                </div>
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    isLoading={isFetching}
                />
            )}
        </div>
    );
}

// ─── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPageChange, isLoading }) {
    const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        if (totalPages <= 7) return i + 1;
        if (page <= 4) return i + 1;
        if (page >= totalPages - 3) return totalPages - 6 + i;
        return page - 3 + i;
    });

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1 || isLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                ‹
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    disabled={isLoading}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 ${p === page
                            ? 'bg-brand-500 text-white shadow-md'
                            : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600'
                        }`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages || isLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                ›
            </button>
        </div>
    );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">🔍</span>
            </div>
            <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2">
                No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                Try adjusting your search or filters
            </p>
        </div>
    );
}
