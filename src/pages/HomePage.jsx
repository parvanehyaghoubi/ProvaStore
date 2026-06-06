import ProductList from '../components/ProductList/ProductList';

export default function HomePage() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero */}
            <div className="mb-10 animate-slide-up">
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    Discover <span className="text-brand-500">Great</span> Products
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                    Browse thousands of products curated just for you.
                </p>
            </div>

            <ProductList />
        </main>
    );
}
